<svelte:head>
	<title>Prompt Construction Pipeline — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Prompt Construction Pipeline</h1>
	<p class="page-subtitle">
		A Task object is assembled into an agent prompt layer by layer. Each layer is conditional — absent layers leave no trace in the final output.
	</p>

	<div class="source-ref">
		<span class="ref-label">File</span>
		<code class="ref-path">modules/agent/src/prompt-renderer.ts</code>
	</div>

	<div class="layers">

		<div class="layer layer--always">
			<div class="layer-header">
				<span class="layer-badge always">always present</span>
				<h2 class="layer-title">Layer 1 — System Prompt</h2>
			</div>
			<div class="layer-body card">
				<p class="layer-desc">
					Defines the agent's operating contract. Instructions to validate work, surface assumptions, and produce a structured handoff at the end of each run. Configurable per agent profile via <code>systemPrompt</code> — if not set, a default is applied.
				</p>
				<div class="layer-detail">
					<span class="detail-key">config key</span>
					<code class="detail-val">agents.&lt;profile&gt;.systemPrompt</code>
				</div>
			</div>
		</div>

		<div class="layer-connector"></div>

		<div class="layer layer--always">
			<div class="layer-header">
				<span class="layer-badge always">always present</span>
				<h2 class="layer-title">Layer 2 — Task Template</h2>
			</div>
			<div class="layer-body card">
				<p class="layer-desc">
					The core task content rendered from <code>DEFAULT_TASK_TEMPLATE</code>. Template variables are substituted from the task record. If a variable is undefined or empty, its entire section (including the section header) is omitted — no empty headings in the final prompt.
				</p>
				<div class="template-vars">
					<div class="template-var">
						<code class="var-token">{'{{'+'title'+'}}'}</code>
						<span class="var-source">← task.title</span>
					</div>
					<div class="template-var">
						<code class="var-token">{'{{'+'description'+'}}'}</code>
						<span class="var-source">← task.description</span>
					</div>
					<div class="template-var">
						<code class="var-token">{'{{'+'acceptanceCriteria'+'}}'}</code>
						<span class="var-source">← task.acceptanceCriteria</span>
					</div>
				</div>
			</div>
		</div>

		<div class="layer-connector"></div>

		<div class="layer layer--conditional">
			<div class="layer-header">
				<span class="layer-badge conditional">conditional</span>
				<h2 class="layer-title">Layer 3 — Retry Context</h2>
			</div>
			<div class="layer-body card">
				<div class="condition-pill">Present only on retry attempts (retryCount &gt; 0)</div>
				<p class="layer-desc">
					Injects the prior run's <code>AgentHandoff.summary</code> as <code>{'{{previousRunSummary}}'}</code>. Gives the agent different context on the second attempt — critical for <code>error_max_turns</code> failures, where the agent may have been on the right track but ran out of turns.
				</p>
				<div class="layer-detail">
					<span class="detail-key">source</span>
					<code class="detail-val">lastRun.handoff.summary</code>
				</div>
			</div>
		</div>

		<div class="layer-connector"></div>

		<div class="layer layer--conditional">
			<div class="layer-header">
				<span class="layer-badge conditional">conditional</span>
				<h2 class="layer-title">Layer 4 — Review Feedback</h2>
			</div>
			<div class="layer-body card">
				<div class="condition-pill">Present only when task returns from review → ready</div>
				<p class="layer-desc">
					Review rejection always uses <code>forkSession</code> with <code>promptOverride</code> via <code>renderReviewPrompt(reviewComment)</code> — a minimal prompt, since the forked session already has full conversation context from the prior run. The <code>{'{{reviewComment}}'}</code> template variable applies when a task already had a <code>reviewComment</code> set at first dispatch.
				</p>
				<div class="fork-note">
					<span class="fork-label">fork path</span>
					<span class="fork-desc">Session forked from prior run ID — reviewer comment injected as promptOverride into existing context</span>
				</div>
			</div>
		</div>

		<div class="layer-connector"></div>

		<div class="layer layer--conditional">
			<div class="layer-header">
				<span class="layer-badge conditional">conditional</span>
				<h2 class="layer-title">Layer 5 — Parent Task Enrichment</h2>
			</div>
			<div class="layer-body card">
				<div class="condition-pill">Present only for parent tasks with subtasks (and no promptOverride)</div>
				<p class="layer-desc">
					Calls <code>renderParentTaskPrompt()</code> to append a numbered subtask checklist to the description. The agent sees all sibling tasks — their titles, descriptions, and current status — enabling coordination and avoiding redundant work.
				</p>
				<div class="layer-detail">
					<span class="detail-key">rendered by</span>
					<code class="detail-val">renderParentTaskPrompt(task, subtasks)</code>
				</div>
			</div>
		</div>

		<div class="layer-connector"></div>

		<div class="layer layer--always">
			<div class="layer-header">
				<span class="layer-badge always">always present</span>
				<h2 class="layer-title">Layer 6 — SDK Options</h2>
			</div>
			<div class="layer-body card">
				<p class="layer-desc">
					Not injected into the prompt text — passed as structured options to the SDK <code>query()</code> call. Controls agent behavior at the SDK level.
				</p>
				<div class="sdk-options">
					<div class="sdk-group">
						<div class="sdk-group-title">Execution</div>
						<div class="sdk-option-list">
							<code>model</code>
							<code>maxTurns</code>
							<code>maxBudgetUsd</code>
							<code>effort</code>
						</div>
					</div>
					<div class="sdk-group">
						<div class="sdk-group-title">Permissions</div>
						<div class="sdk-option-list">
							<code>permissionMode</code>
							<code>allowedTools</code>
							<code>disallowedTools</code>
						</div>
					</div>
					<div class="sdk-group">
						<div class="sdk-group-title">Output</div>
						<div class="sdk-option-list">
							<code>outputFormat</code>
							<span class="sdk-note">(Zod → JSON Schema)</span>
						</div>
					</div>
					<div class="sdk-group">
						<div class="sdk-group-title">Sessions</div>
						<div class="sdk-option-list">
							<code>enableFileCheckpointing</code>
							<code>resumeSessionId</code>
							<code>forkSession</code>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
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
		margin-bottom: 24px;
	}

	.source-ref {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 36px;
	}

	.ref-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cr-text-dim);
	}

	.ref-path {
		font-family: var(--font-mono);
		font-size: 0.825rem;
		color: var(--cr-amber);
	}

	/* ── Layer stack ────────────────────────────────────────────────────────── */
	.layers {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.layer-connector {
		width: 2px;
		height: 20px;
		background: var(--cr-rule-bright);
		margin-left: 20px;
	}

	.layer {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.layer-header {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.layer-badge {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 3px 8px;
		border-radius: 3px;
	}

	.layer-badge.always {
		background: rgba(90, 138, 90, 0.15);
		color: var(--cr-moss);
		border: 1px solid rgba(90, 138, 90, 0.3);
	}

	.layer-badge.conditional {
		background: rgba(232, 162, 48, 0.1);
		color: var(--cr-amber);
		border: 1px solid var(--cr-amber-dim);
	}

	.layer-title {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--cr-text);
	}

	/* ── Card ───────────────────────────────────────────────────────────────── */
	.card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 20px 24px;
	}

	.layer--always .layer-body {
		border-left: 3px solid var(--cr-moss);
	}

	.layer--conditional .layer-body {
		border-left: 3px solid var(--cr-amber-dim);
	}

	.layer-desc {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 12px;
	}

	.layer-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Condition pill ─────────────────────────────────────────────────────── */
	.condition-pill {
		display: inline-block;
		font-family: var(--font-body);
		font-size: 0.775rem;
		color: var(--cr-amber);
		background: rgba(232, 162, 48, 0.08);
		border: 1px solid var(--cr-amber-dim);
		border-radius: 3px;
		padding: 4px 10px;
		margin-bottom: 12px;
	}

	/* ── Template vars ──────────────────────────────────────────────────────── */
	.template-vars {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.template-var {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.var-token {
		font-family: var(--font-mono);
		font-size: 0.825rem;
		color: var(--cr-copper);
		background: rgba(200, 113, 58, 0.1);
		padding: 3px 8px;
		border-radius: 3px;
		min-width: 200px;
	}

	.var-source {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
	}

	/* ── Layer detail ───────────────────────────────────────────────────────── */
	.layer-detail {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-top: 10px;
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
		font-size: 0.8rem;
		color: var(--cr-text-mid);
	}

	/* ── Fork note ──────────────────────────────────────────────────────────── */
	.fork-note {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		padding: 8px 12px;
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		margin-top: 4px;
	}

	.fork-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-copper);
		flex-shrink: 0;
		padding-top: 1px;
	}

	.fork-desc {
		font-family: var(--font-body);
		font-size: 0.825rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}

	/* ── SDK options ────────────────────────────────────────────────────────── */
	.sdk-options {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 16px;
	}

	.sdk-group-title {
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-text-dim);
		margin-bottom: 8px;
	}

	.sdk-option-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.sdk-option-list code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-mid);
	}

	.sdk-note {
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--cr-text-dim);
		font-style: italic;
	}
</style>
