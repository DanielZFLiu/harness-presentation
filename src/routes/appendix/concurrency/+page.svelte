<svelte:head>
	<title>Concurrency & Dispatch Model — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Concurrency &amp; Dispatch Model</h1>
	<p class="page-subtitle">
		Multiple tasks run simultaneously. The dispatcher manages slots, priorities, and failure recovery — without blocking the event loop.
	</p>

	<div class="files-row">
		{#each [
			'modules/daemon/src/dispatcher.ts',
			'modules/daemon/src/poll-loop.ts',
			'modules/daemon/src/rate-limiter.ts',
			'modules/daemon/src/retry.ts',
		] as f}
			<code class="file-ref">{f}</code>
		{/each}
	</div>

	<section class="section">
		<h2 class="section-title">Poll Loop</h2>
		<div class="card">
			<p class="desc">
				Hybrid wake-up model: event-driven for low latency, polling as a safety net. No tasks are missed even if an event is dropped.
			</p>
			<div class="wake-up-row">
				<div class="wake-item">
					<div class="wake-icon amber-icon">E</div>
					<div class="wake-body">
						<div class="wake-title">Event-driven wake</div>
						<div class="wake-desc"><code>task:transition</code> event signals an immediate dispatch check — zero latency from task becoming ready to dispatch attempt.</div>
					</div>
				</div>
				<div class="wake-item">
					<div class="wake-icon dim-icon">T</div>
					<div class="wake-body">
						<div class="wake-title">Polling fallback</div>
						<div class="wake-desc">At a configurable interval (default: 30s), the loop wakes unconditionally. Catches any transitions missed during a transient event-bus gap.</div>
					</div>
				</div>
				<div class="wake-item">
					<div class="wake-icon moss-icon">C</div>
					<div class="wake-body">
						<div class="wake-title">Completion trigger</div>
						<div class="wake-desc">Task state transitions (running→review, review→done) emit bus events that wake the loop immediately. Maximizes slot utilization.</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Dispatch Cycle</h2>
		<div class="card">
			<div class="cycle-steps">

				<div class="cycle-step">
					<div class="cycle-num">1</div>
					<div class="cycle-content">
						<div class="cycle-title">Check effective concurrency</div>
						<p class="cycle-desc">
							<code>rateLimiter.effectiveConcurrency</code> — may be reduced from the configured maximum if a rate limit warning is active. Available slots = effectiveConcurrency − activeRuns.size.
						</p>
					</div>
				</div>

				<div class="cycle-step">
					<div class="cycle-num">2</div>
					<div class="cycle-content">
						<div class="cycle-title">Gather candidates</div>
						<p class="cycle-desc">
							Two sources: tasks with status <code>ready</code> (new work), and tasks with status <code>queued</code> that have passed their <code>retryReadyAt</code> timestamp (retry work).
						</p>
					</div>
				</div>

				<div class="cycle-step">
					<div class="cycle-num">3</div>
					<div class="cycle-content">
						<div class="cycle-title">Sort by priority</div>
						<div class="priority-table">
							<div class="priority-row header-row">
								<span>Order</span>
								<span>Criteria</span>
								<span>Rationale</span>
							</div>
							<div class="priority-row">
								<span class="priority-num">1st</span>
								<span>Retry before new</span>
								<span class="priority-reason">Previously attempted work takes priority over new intake</span>
							</div>
							<div class="priority-row">
								<span class="priority-num">2nd</span>
								<span>Critical → High → Normal → Low</span>
								<span class="priority-reason">User-assigned priority respected</span>
							</div>
							<div class="priority-row">
								<span class="priority-num">3rd</span>
								<span>Earlier createdAt first</span>
								<span class="priority-reason">FIFO within same priority</span>
							</div>
						</div>
					</div>
				</div>

				<div class="cycle-step">
					<div class="cycle-num">4</div>
					<div class="cycle-content">
						<div class="cycle-title">Reserve slot immediately</div>
						<p class="cycle-desc">
							Before any async work begins, a placeholder is inserted into the <code>activeRuns</code> Map. This prevents two concurrent dispatch cycles from double-filling the same slot during the async gap between "check" and "start."
						</p>
						<div class="code-inline">activeRuns.set(taskId, placeholderAdapter) // before await</div>
					</div>
				</div>

				<div class="cycle-step">
					<div class="cycle-num">5</div>
					<div class="cycle-content">
						<div class="cycle-title">Fire-and-forget dispatch</div>
						<p class="cycle-desc">
							<code>dispatchTask()</code> is called without <code>await</code>. The dispatch cycle continues to the next task immediately. Completion is handled by the <code>finally</code> block inside the run.
						</p>
						<div class="code-inline">dispatchTask(task) // no await — intentional</div>
					</div>
				</div>

				<div class="cycle-step">
					<div class="cycle-num">6</div>
					<div class="cycle-content">
						<div class="cycle-title">Release on completion</div>
						<p class="cycle-desc">
							The <code>finally</code> block: delete from <code>activeRuns</code>, signal the poll loop to check for more work. Fires on success, error, and cancellation alike.
						</p>
					</div>
				</div>

			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Concurrency Safety</h2>
		<div class="safety-grid">
			<div class="safety-card card">
				<h3 class="safety-title">Slot reservation</h3>
				<p class="safety-desc">
					The slot is reserved with a placeholder adapter <em>before</em> any async work. If workspace provisioning throws, the slot is still released by the <code>finally</code> block. No leaked slots.
				</p>
			</div>
			<div class="safety-card card">
				<h3 class="safety-title">Per-run adapters</h3>
				<p class="safety-desc">
					Each dispatched task gets its own <code>ClaudeAgentAdapter</code> instance. <code>cancel()</code> targets exactly that run's <code>AbortController</code> — not a shared instance.
				</p>
			</div>
			<div class="safety-card card">
				<h3 class="safety-title">Local session state</h3>
				<p class="safety-desc">
					<code>lastSessionId</code> and <code>lastCheckpointId</code> are local variables inside the <code>run()</code> closure — not instance fields. Concurrent runs can't clobber each other's session context.
				</p>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Rate Limiter</h2>
		<div class="card">
			<p class="desc">
				The rate limiter intercepts API-level feedback from the Claude service and adjusts dispatch behavior accordingly.
			</p>
			<div class="rate-table">
				<div class="rate-row rate-header">
					<span>Status</span>
					<span>Trigger</span>
					<span>Effect</span>
					<span>Duration</span>
				</div>
				<div class="rate-row">
					<span class="status-badge rejected">rejected</span>
					<span class="rate-detail">Hard rate limit from API</span>
					<span class="rate-effect">Pause ALL dispatch</span>
					<span class="rate-time">Until resetsAt timestamp</span>
				</div>
				<div class="rate-row">
					<span class="status-badge warning">allowed_warning</span>
					<span class="rate-detail">Soft warning from API</span>
					<span class="rate-effect">Halve effective concurrency</span>
					<span class="rate-time">5-minute cooldown</span>
				</div>
				<div class="rate-row">
					<span class="status-badge ok">allowed</span>
					<span class="rate-detail">Normal response</span>
					<span class="rate-effect">Full concurrency restored</span>
					<span class="rate-time">Immediate</span>
				</div>
			</div>
			<p class="rate-note">
				Rate limiting affects only new dispatches — in-flight runs continue until they complete or fail naturally.
			</p>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Retry Backoff</h2>
		<div class="card">
			<div class="retry-row">
				<div class="retry-col">
					<h3 class="retry-title">Exponential delay</h3>
					<p class="retry-desc">
						<code>calculateBackoff(retryCount)</code> computes a delay that grows with each attempt. The first retry waits a short interval; subsequent retries wait longer. Prevents hammering a repeatedly-failing task.
					</p>
				</div>
				<div class="retry-col">
					<h3 class="retry-title">Priority elevation</h3>
					<p class="retry-desc">
						Retry tasks are sorted before new tasks at the same priority level. A task that's been tried once gets ahead of fresh backlog — it's closer to completion.
					</p>
				</div>
				<div class="retry-col">
					<h3 class="retry-title">Premature dispatch guard</h3>
					<p class="retry-desc">
						<code>retryReadyAt</code> map stores the earliest timestamp at which a task may be re-dispatched. Checked at the top of the dispatch cycle — tasks not yet ready are skipped without being removed from candidates.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.page {
		padding-bottom: 48px;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 700;
		color: var(--cr-text);
		letter-spacing: -0.02em;
		margin-bottom: 8px;
	}

	.page-subtitle {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 20px;
	}

	.files-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 40px;
	}

	.file-ref {
		font-family: var(--font-mono);
		font-size: 0.775rem;
		color: var(--cr-amber);
		background: rgba(232, 162, 48, 0.08);
		border: 1px solid var(--cr-amber-dim);
		padding: 3px 8px;
		border-radius: 3px;
	}

	/* ── Section ────────────────────────────────────────────────────────────── */
	.section {
		margin-bottom: 48px;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 16px;
	}

	.card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 24px;
	}

	.desc {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 20px;
	}

	/* ── Wake-up row ────────────────────────────────────────────────────────── */
	.wake-up-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
	}

	.wake-item {
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.wake-icon {
		width: 28px;
		height: 28px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.amber-icon { background: rgba(232, 162, 48, 0.2); color: var(--cr-amber); }
	.dim-icon { background: var(--cr-surface-alt); color: var(--cr-text-dim); }
	.moss-icon { background: rgba(90, 138, 90, 0.15); color: var(--cr-moss); }

	.wake-title {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 4px;
	}

	.wake-desc {
		font-family: var(--font-body);
		font-size: 0.825rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}

	.wake-desc code {
		font-family: var(--font-mono);
		font-size: 0.775rem;
		color: var(--cr-amber);
	}

	/* ── Cycle steps ────────────────────────────────────────────────────────── */
	.cycle-steps {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.cycle-step {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--cr-rule);
	}

	.cycle-step:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.cycle-num {
		width: 28px;
		height: 28px;
		border-radius: 4px;
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule-bright);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.cycle-content {
		flex: 1;
	}

	.cycle-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.cycle-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 8px;
	}

	.cycle-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	.code-inline {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-mid);
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		padding: 6px 10px;
		border-radius: 3px;
	}

	/* ── Priority table ─────────────────────────────────────────────────────── */
	.priority-table {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		overflow: hidden;
	}

	.priority-row {
		display: grid;
		grid-template-columns: 60px 1fr 1fr;
		gap: 16px;
		padding: 8px 12px;
		font-family: var(--font-body);
		font-size: 0.825rem;
		color: var(--cr-text-mid);
		border-bottom: 1px solid var(--cr-rule);
	}

	.priority-row:last-child {
		border-bottom: none;
	}

	.header-row {
		background: var(--cr-surface-alt);
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--cr-text-dim);
	}

	.priority-num {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	.priority-reason {
		color: var(--cr-text-dim);
		font-size: 0.8rem;
	}

	/* ── Safety grid ────────────────────────────────────────────────────────── */
	.safety-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
	}

	.safety-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 8px;
	}

	.safety-desc {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.safety-desc em {
		color: var(--cr-amber);
		font-style: normal;
	}

	.safety-desc code {
		font-family: var(--font-mono);
		font-size: 0.775rem;
		color: var(--cr-amber);
	}

	/* ── Rate table ─────────────────────────────────────────────────────────── */
	.rate-table {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 12px;
	}

	.rate-row {
		display: grid;
		grid-template-columns: 140px 1fr 1fr 1fr;
		gap: 16px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--cr-rule);
		align-items: center;
	}

	.rate-row:last-child {
		border-bottom: none;
	}

	.rate-header {
		background: var(--cr-surface-alt);
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--cr-text-dim);
	}

	.status-badge {
		font-family: var(--font-mono);
		font-size: 0.725rem;
		padding: 3px 8px;
		border-radius: 3px;
		display: inline-block;
	}

	.status-badge.rejected {
		background: rgba(181, 74, 58, 0.15);
		color: var(--cr-ember);
		border: 1px solid rgba(181, 74, 58, 0.3);
	}

	.status-badge.warning {
		background: rgba(232, 162, 48, 0.1);
		color: var(--cr-amber);
		border: 1px solid var(--cr-amber-dim);
	}

	.status-badge.ok {
		background: rgba(90, 138, 90, 0.12);
		color: var(--cr-moss);
		border: 1px solid rgba(90, 138, 90, 0.3);
	}

	.rate-detail, .rate-effect, .rate-time {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-mid);
	}

	.rate-note {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		line-height: 1.5;
	}

	/* ── Retry row ──────────────────────────────────────────────────────────── */
	.retry-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 20px;
	}

	.retry-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 8px;
	}

	.retry-desc {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.retry-desc code {
		font-family: var(--font-mono);
		font-size: 0.775rem;
		color: var(--cr-amber);
	}
</style>
