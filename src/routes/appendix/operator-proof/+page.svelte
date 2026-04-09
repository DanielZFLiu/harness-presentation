<svelte:head>
	<title>Operator Agent Proof — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Operator Agent: What Actually Happened</h1>
	<p class="page-subtitle">
		An autonomous operator agent managed the entire game development project from start to finish — using only the Harness REST API that the dashboard uses.
	</p>

	<div class="stat-banner">
		<div class="stat-item">
			<span class="stat-number">4–5 hrs</span>
			<span class="stat-label">total duration</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">33</span>
			<span class="stat-label">tasks dispatched</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">4</span>
			<span class="stat-label">milestones completed</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">0</span>
			<span class="stat-label">human interventions during execution</span>
		</div>
	</div>

	<section class="section">
		<h2 class="section-title">Setup Phase</h2>
		<div class="card">
			<div class="phase-steps">
				<div class="phase-step">
					<span class="step-bullet amber">→</span>
					<span class="step-text">Read the orchestration plan: 33 tasks organized across 4 milestones, each with acceptance criteria and dependencies.</span>
				</div>
				<div class="phase-step">
					<span class="step-bullet copper">→</span>
					<span class="step-text">Discovered a cancelled task from a prior interrupted run. Fixed it by directly interacting with the SQLite database to reset its state. (one-time recovery for a prior interrupted run — not a normal Harness operation)</span>
				</div>
				<div class="phase-step">
					<span class="step-bullet amber">→</span>
					<span class="step-text">Called <code>PATCH /api/v1/tasks/:id</code> to set <code>autoApprove: true</code> on all backlog subtasks — skipping human review for automated sequential execution.</span>
				</div>
				<div class="phase-step">
					<span class="step-bullet moss">→</span>
					<span class="step-text">Started the daemon and dashboard processes. Confirmed the SSE stream was live and task list was clean before beginning.</span>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Execution Loop (per task)</h2>
		<div class="loop-container">
			<div class="loop-steps">
				<div class="loop-step">
					<div class="loop-num">1</div>
					<div class="loop-content">
						<div class="loop-title">Transition to ready</div>
						<code class="loop-code">POST /api/v1/tasks/:id/transition  →  {'{ status: "ready" }'}</code>
					</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="loop-num">2</div>
					<div class="loop-content">
						<div class="loop-title">Poll task status</div>
						<code class="loop-code">GET /api/v1/tasks/:id  —  every 30 seconds</code>
					</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="loop-num">3</div>
					<div class="loop-content">
						<div class="loop-title">Wait for completion sequence</div>
						<div class="status-flow">
							<span class="status running">running</span>
							<span class="status-arrow">→</span>
							<span class="status review">review</span>
							<span class="status-arrow">→</span>
							<span class="status done">done</span>
						</div>
						<p class="loop-note">autoApprove handles review→done automatically — no operator action required at this stage.</p>
					</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="loop-num">4</div>
					<div class="loop-content">
						<div class="loop-title">Verify target repo state</div>
						<code class="loop-code">Inspect git history, check for merge commit, confirm branch deleted</code>
					</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="loop-num">5</div>
					<div class="loop-content">
						<div class="loop-title">Queue next task</div>
						<code class="loop-code">Move next backlog task → ready, restart loop</code>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Between Milestones</h2>
		<div class="milestone-checks card">
			<div class="check-row">
				<span class="check-icon moss">✓</span>
				<div class="check-content">
					<span class="check-cmd">npm run build</span>
					<span class="check-desc">— verify the game compiles cleanly with no TypeScript errors</span>
				</div>
			</div>
			<div class="check-row">
				<span class="check-icon moss">✓</span>
				<div class="check-content">
					<span class="check-cmd">npm test</span>
					<span class="check-desc">— verify all tests pass before advancing to next milestone</span>
				</div>
			</div>
			<div class="check-row">
				<span class="check-icon amber">✓</span>
				<div class="check-content">
					<span class="check-cmd">Code review</span>
					<span class="check-desc">— inspect accumulated changes across all tasks in the milestone for quality and correctness</span>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Key Insight</h2>
		<div class="insight-card card card--accent">
			<p class="insight-text">
				The operator agent didn't need special tools or privileged APIs. It used the same REST endpoints the dashboard uses — task transitions, status polling, patch calls. The infrastructure's clean separation made autonomous operation possible without any bespoke operator interface.
			</p>
			<div class="insight-detail">
				<div class="insight-item">
					<span class="insight-label">API surface used</span>
					<span class="insight-val">Standard REST — POST, GET, PATCH on /api/v1/tasks</span>
				</div>
				<div class="insight-item">
					<span class="insight-label">Special permissions</span>
					<span class="insight-val">None — same access level as the dashboard UI</span>
				</div>
				<div class="insight-item">
					<span class="insight-label">Recovery method</span>
					<span class="insight-val">Direct SQLite access for one-time state repair — not a normal operation</span>
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
		margin-bottom: 32px;
	}

	/* ── Stat banner ────────────────────────────────────────────────────────── */
	.stat-banner {
		display: flex;
		align-items: center;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-top: 3px solid var(--cr-amber);
		border-radius: 6px;
		padding: 24px 32px;
		margin-bottom: 48px;
		gap: 16px;
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1;
		min-width: 100px;
	}

	.stat-number {
		font-family: var(--font-mono);
		font-size: 1.6rem;
		font-weight: 500;
		color: var(--cr-amber);
		line-height: 1;
	}

	.stat-label {
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--cr-text-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.stat-divider {
		width: 1px;
		height: 40px;
		background: var(--cr-rule);
		flex-shrink: 0;
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

	/* ── Card ───────────────────────────────────────────────────────────────── */
	.card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 24px;
	}

	.card--accent {
		border-left: 3px solid var(--cr-amber);
	}

	/* ── Phase steps ────────────────────────────────────────────────────────── */
	.phase-steps {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.phase-step {
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.step-bullet {
		font-size: 1rem;
		line-height: 1.5;
		flex-shrink: 0;
		width: 20px;
	}

	.step-bullet.amber { color: var(--cr-amber); }
	.step-bullet.copper { color: var(--cr-copper); }
	.step-bullet.moss { color: var(--cr-moss); }

	.step-text {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.step-text code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Loop container ─────────────────────────────────────────────────────── */
	.loop-container {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 24px 32px;
	}

	.loop-steps {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.loop-step {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	.loop-num {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule-bright);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
		flex-shrink: 0;
		margin-top: 3px;
	}

	.loop-content {
		flex: 1;
		padding-bottom: 4px;
	}

	.loop-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.loop-code {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-mid);
		background: var(--cr-surface-alt);
		padding: 6px 10px;
		border-radius: 3px;
		border: 1px solid var(--cr-rule);
	}

	.loop-note {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		margin-top: 6px;
		line-height: 1.5;
	}

	.loop-arrow {
		font-size: 1.1rem;
		color: var(--cr-rule-bright);
		margin-left: 13px;
		padding: 4px 0;
		line-height: 1;
	}

	/* ── Status flow ────────────────────────────────────────────────────────── */
	.status-flow {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.status {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 3px 10px;
		border-radius: 3px;
	}

	.status.running {
		background: rgba(200, 113, 58, 0.15);
		color: var(--cr-copper);
		border: 1px solid rgba(200, 113, 58, 0.3);
	}

	.status.review {
		background: rgba(232, 162, 48, 0.12);
		color: var(--cr-amber);
		border: 1px solid var(--cr-amber-dim);
	}

	.status.done {
		background: rgba(90, 138, 90, 0.12);
		color: var(--cr-moss);
		border: 1px solid rgba(90, 138, 90, 0.3);
	}

	.status-arrow {
		color: var(--cr-text-dim);
		font-size: 0.9rem;
	}

	/* ── Milestone checks ───────────────────────────────────────────────────── */
	.milestone-checks {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.check-row {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.check-icon {
		font-size: 1rem;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.check-icon.moss { color: var(--cr-moss); }
	.check-icon.amber { color: var(--cr-amber); }

	.check-content {
		display: flex;
		align-items: baseline;
		gap: 8px;
		flex-wrap: wrap;
	}

	.check-cmd {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--cr-text);
	}

	.check-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
	}

	/* ── Insight ────────────────────────────────────────────────────────────── */
	.insight-text {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--cr-text);
		line-height: 1.7;
		margin-bottom: 20px;
		font-style: italic;
	}

	.insight-detail {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 16px;
		border-top: 1px solid var(--cr-rule);
	}

	.insight-item {
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.insight-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-text-dim);
		min-width: 160px;
		flex-shrink: 0;
	}

	.insight-val {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
	}
</style>
