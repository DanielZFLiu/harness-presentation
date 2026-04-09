<svelte:head>
	<title>Cost Tracking Architecture — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Cost Tracking Architecture</h1>
	<p class="page-subtitle">
		Budget enforcement happens mid-run — not after. Two layers of control: per-task caps and a daemon-wide daily limit.
	</p>

	<section class="section">
		<h2 class="section-title">Mid-Run Enforcement Flow</h2>
		<div class="flow-container card">
			<div class="flow-steps">

				<div class="flow-step">
					<div class="step-num amber">1</div>
					<div class="step-content">
						<div class="step-title">Cost Event Emission</div>
						<p class="step-desc">
							The adapter emits a <code>cost</code> event for each <code>AssistantMessage</code> from the SDK. Each event carries the full cumulative totals: <code>cumulativeCostUsd</code>, <code>inputTokens</code>, <code>outputTokens</code>.
						</p>
						<div class="step-tag">per-message, cumulative</div>
					</div>
				</div>

				<div class="flow-connector"></div>

				<div class="flow-step">
					<div class="step-num amber">2</div>
					<div class="step-content">
						<div class="step-title">Delta Recording</div>
						<p class="step-desc">
							The dispatcher's <code>onEvent</code> callback computes the delta: <code>current − lastRecorded</code>. Only the incremental cost is passed to <code>CostTracker</code>. This prevents double-counting when events are emitted incrementally.
						</p>
						<div class="step-tag">delta = current − last</div>
					</div>
				</div>

				<div class="flow-connector"></div>

				<div class="flow-step">
					<div class="step-num amber">3</div>
					<div class="step-content">
						<div class="step-title">Budget Check</div>
						<p class="step-desc">
							CostTracker increments the daily total and checks: <code>todayTotal + delta &gt; dailyBudget</code>. With single-task dispatch (<code>maxConcurrency: 1</code>), the check is safe. Higher concurrency requires the pre-dispatch check in <code>canDispatch()</code>.
						</p>
						<div class="step-tag">atomic UPSERT via SQLite</div>
					</div>
				</div>

				<div class="flow-connector flow-connector--split">
					<div class="split-line ok">under budget → continue</div>
					<div class="split-line warn">over budget → cancel</div>
				</div>

				<div class="flow-step step--terminal">
					<div class="step-num ember">4</div>
					<div class="step-content">
						<div class="step-title">Agent Cancellation</div>
						<p class="step-desc">
							If the daily budget is exceeded, <code>adapter.cancel()</code> is called immediately. The <code>AbortController</code> terminates the SDK process. Note: <code>error_max_budget_usd</code> is the SDK's own per-session budget stop reason — distinct from the daemon's daily budget enforcement here.
						</p>
						<div class="step-tag ember-tag">terminal — not retried</div>
					</div>
				</div>

				<div class="flow-connector"></div>

				<div class="flow-step">
					<div class="step-num moss">5</div>
					<div class="step-content">
						<div class="step-title">Completion Settlement</div>
						<p class="step-desc">
							When a run completes normally, only the remaining delta is recorded: <code>max(0, result.costUsd − lastRecordedCost)</code>. This accounts for any cost that arrived between the last mid-run event and the final result, without double-counting.
						</p>
						<div class="step-tag">prevents double-counting at boundary</div>
					</div>
				</div>

			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Budget Control Layers</h2>
		<div class="controls-grid">

			<div class="control-card card card--accent">
				<div class="control-header">
					<span class="control-scope amber-badge">per-run</span>
					<h3 class="control-title">maxBudgetUsd</h3>
				</div>
				<p class="control-desc">
					Caps spend for a single task run. Defined in the agent profile. The SDK enforces this natively — the agent process terminates when reached. Independent of the daemon's daily budget.
				</p>
				<div class="control-detail">
					<span class="detail-key">set in</span>
					<code class="detail-val">harness.config.json → agents.&lt;profile&gt;.maxBudgetUsd</code>
				</div>
			</div>

			<div class="control-card card card--accent-copper">
				<div class="control-header">
					<span class="control-scope copper-badge">daemon-wide</span>
					<h3 class="control-title">dailyBudgetUsd</h3>
				</div>
				<p class="control-desc">
					Caps total spend across all tasks in a calendar day. Checked mid-run via CostTracker. Persisted in SQLite — survives daemon restarts. Automatically rolls over at midnight via <code>resetIfNewDay()</code>.
				</p>
				<div class="control-detail">
					<span class="detail-key">set in</span>
					<code class="detail-val">harness.config.json → daemon.dailyBudgetUsd</code>
				</div>
			</div>

		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Supporting Infrastructure</h2>
		<div class="infra-grid">

			<div class="infra-item card">
				<h3 class="infra-title">CostTracker.canDispatch()</h3>
				<p class="infra-desc">
					Checked before every task dispatch in the poll loop. If the daily budget is already exhausted, no new tasks start. Existing in-flight runs are not affected.
				</p>
			</div>

			<div class="infra-item card">
				<h3 class="infra-title">SqliteCostStore</h3>
				<p class="infra-desc">
					Stores daily totals as <code>UPSERT</code> into a <code>daily_costs</code> table. Atomic increment: <code>cost = cost + delta</code> in a single statement. No read-modify-write race.
				</p>
			</div>

			<div class="infra-item card">
				<h3 class="infra-title">resetIfNewDay()</h3>
				<p class="infra-desc">
					Called on each poll tick. Checks the stored date against the current date. If a new day has started, inserts a fresh row with zero cost. No cron job needed — the daemon manages its own rollover.
				</p>
			</div>

			<div class="infra-item card">
				<h3 class="infra-title">model_usage column</h3>
				<p class="infra-desc">
					Each run stores a <code>model_usage</code> JSON blob with per-model token breakdowns. Enables retrospective cost analysis even if the daily total has rolled over.
				</p>
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
		margin-bottom: 40px;
	}

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

	.card--accent-copper {
		border-left: 3px solid var(--cr-copper);
	}

	/* ── Flow steps ─────────────────────────────────────────────────────────── */
	.flow-container {
		padding: 28px 32px;
	}

	.flow-steps {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.flow-step {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	.step-num {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--cr-bg);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.step-num.amber { background: var(--cr-amber); }
	.step-num.ember { background: var(--cr-ember); }
	.step-num.moss { background: var(--cr-moss); }

	.step-content {
		flex: 1;
		padding-bottom: 4px;
	}

	.step-title {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.step-desc {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 8px;
	}

	.step-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	.step-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--cr-text-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.ember-tag {
		color: var(--cr-ember);
	}

	.step--terminal .step-content {
		border-left: 2px solid var(--cr-ember);
		padding-left: 12px;
	}

	/* ── Connectors ─────────────────────────────────────────────────────────── */
	.flow-connector {
		width: 2px;
		height: 24px;
		background: var(--cr-rule-bright);
		margin-left: 15px;
	}

	.flow-connector--split {
		width: auto;
		height: auto;
		background: none;
		margin-left: 0;
		display: flex;
		gap: 20px;
		padding: 8px 0 8px 48px;
	}

	.split-line {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 4px 10px;
		border-radius: 3px;
	}

	.split-line.ok {
		color: var(--cr-moss);
		background: rgba(90, 138, 90, 0.12);
		border: 1px solid rgba(90, 138, 90, 0.3);
	}

	.split-line.warn {
		color: var(--cr-ember);
		background: rgba(181, 74, 58, 0.12);
		border: 1px solid rgba(181, 74, 58, 0.3);
	}

	/* ── Controls grid ──────────────────────────────────────────────────────── */
	.controls-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.control-card {
		padding: 20px 24px;
	}

	.control-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	.control-scope {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 2px 8px;
		border-radius: 3px;
	}

	.amber-badge {
		background: var(--cr-amber);
		color: var(--cr-bg);
	}

	.copper-badge {
		background: var(--cr-copper);
		color: var(--cr-bg);
	}

	.control-title {
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 500;
		color: var(--cr-text);
	}

	.control-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 12px;
	}

	.control-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	.control-detail {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--cr-rule);
	}

	.detail-key {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-text-dim);
		flex-shrink: 0;
	}

	.detail-val {
		font-family: var(--font-mono);
		font-size: 0.775rem;
		color: var(--cr-text-mid);
	}

	/* ── Infra grid ─────────────────────────────────────────────────────────── */
	.infra-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.infra-item {
		padding: 20px 24px;
	}

	.infra-title {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--cr-amber);
		margin-bottom: 10px;
	}

	.infra-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.infra-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text);
	}
</style>
