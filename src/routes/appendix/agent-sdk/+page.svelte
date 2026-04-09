<svelte:head>
	<title>Agent SDK Integration — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Agent SDK Integration</h1>
	<p class="page-subtitle">
		The adapter wraps the Claude Agent SDK behind a clean interface. The rest of the system never touches the SDK directly.
	</p>

	<div class="files-row">
		{#each [
			'modules/agent/src/claude-adapter.ts',
			'modules/agent/src/message-mapper.ts',
			'modules/agent/src/quality-gate.ts',
			'modules/agent/src/handoff-schema.ts',
		] as f}
			<code class="file-ref">{f}</code>
		{/each}
	</div>

	<section class="section">
		<h2 class="section-title">Adapter Pattern</h2>
		<div class="card">
			<div class="adapter-grid">
				<div class="adapter-item">
					<span class="adapter-label">Interface</span>
					<p class="adapter-desc">
						<code>ClaudeAgentAdapter</code> implements <code>AgentRuntimeAdapter</code> from <code>@harness/core</code>. The daemon holds a reference to the interface, never the concrete class.
					</p>
				</div>
				<div class="adapter-item">
					<span class="adapter-label">Never throws</span>
					<p class="adapter-desc">
						The adapter always returns a <code>RunResult</code>. Errors are classified and wrapped — the daemon handles them as data, not exceptions.
					</p>
				</div>
				<div class="adapter-item">
					<span class="adapter-label">One per run</span>
					<p class="adapter-desc">
						A new adapter instance is created for each dispatched task. Concurrent runs can't share state — <code>cancel()</code> targets the right <code>AbortController</code>.
					</p>
				</div>
				<div class="adapter-item">
					<span class="adapter-label">Dynamic import</span>
					<p class="adapter-desc">
						Resolved at module load via dynamic import. If unavailable, production callers provide a <code>QueryFactory</code> via the constructor.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Hook System</h2>
		<div class="hooks-list">

			<div class="hook-item card">
				<div class="hook-header">
					<span class="hook-type pre">PreToolUse</span>
					<span class="hook-title">Before every tool call</span>
				</div>
				<div class="hook-actions">
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Emits <code>tool_start</code> event with tool name and timestamp</span>
					</div>
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Command restriction enforcement: deny/allow regex patterns checked; returns <code>{'{'}behavior: "block"{'}'}</code> if denied</span>
					</div>
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Question handling via <code>canUseTool</code> — if agent tries to ask via a tool, the question is captured and surfaced to the dashboard</span>
					</div>
				</div>
			</div>

			<div class="hook-item card">
				<div class="hook-header">
					<span class="hook-type post">PostToolUse</span>
					<span class="hook-title">After every tool call</span>
				</div>
				<div class="hook-actions">
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Emits <code>tool_stop</code> event with elapsed duration (end − start timestamp)</span>
					</div>
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Detects <code>TodoWrite</code> tool calls → emits <code>todo</code> event so the dashboard can display live task progress</span>
					</div>
				</div>
			</div>

			<div class="hook-item card">
				<div class="hook-header">
					<span class="hook-type stop">Stop</span>
					<span class="hook-title">When agent wants to finish</span>
				</div>
				<div class="hook-actions">
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Quality gate enforcement — runs shell commands to verify the work (tests, build, lint)</span>
					</div>
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>If checks fail: returns <code>{'{'}continue: true, systemMessage: "&lt;failure output&gt;"{'}'}</code> — agent gets the failure and must fix it before stopping</span>
					</div>
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>If checks pass: returns <code>{'{}'}</code> (empty object) — agent is allowed to stop</span>
					</div>
				</div>
			</div>

			<div class="hook-item card">
				<div class="hook-header">
					<span class="hook-type worktree">WorktreeCreate</span>
					<span class="hook-title">When subagent creates a worktree</span>
				</div>
				<div class="hook-actions">
					<div class="hook-action">
						<span class="action-bullet">→</span>
						<span>Invokes <code>onWorktreeCreate</code> callback — the daemon supplies the logic to copy <code>.worktreeinclude</code> files into subagent worktrees</span>
					</div>
				</div>
			</div>

		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Structured Output</h2>
		<div class="card">
			<div class="structured-flow">
				<div class="sf-step">
					<div class="sf-num">1</div>
					<div class="sf-content">
						<div class="sf-title">Zod schema definition</div>
						<p class="sf-desc"><code>agentHandoffSchema</code> defined in <code>handoff-schema.ts</code>. Compile-time check verifies it matches the core <code>AgentHandoff</code> type — schema drift is a build error, not a runtime surprise.</p>
					</div>
				</div>
				<div class="sf-step">
					<div class="sf-num">2</div>
					<div class="sf-content">
						<div class="sf-title">JSON Schema conversion</div>
						<p class="sf-desc"><code>toJSONSchema()</code> converts the Zod schema to JSON Schema format for the SDK's <code>outputFormat</code> option. The SDK enforces this as the agent's output structure.</p>
					</div>
				</div>
				<div class="sf-step">
					<div class="sf-num">3</div>
					<div class="sf-content">
						<div class="sf-title">Validation on result</div>
						<p class="sf-desc"><code>safeParse()</code> validates the SDK result before it reaches the daemon. If validation fails, the raw output is wrapped as a plain summary — the run degrades gracefully instead of throwing.</p>
					</div>
				</div>
				<div class="sf-step">
					<div class="sf-num">4</div>
					<div class="sf-content">
						<div class="sf-title">Per-profile output schema</div>
						<p class="sf-desc">Reviewer profiles use a different output schema — the verdict schema instead of the handoff schema. The output format is profile-specific, not hardcoded.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Session Management</h2>
		<div class="session-grid">
			<div class="session-card card">
				<h3 class="session-title">Session capture</h3>
				<p class="session-desc">
					<code>session_id</code> is extracted from the SDK message stream during iteration — not from a single call result. Stored on the run record for future use.
				</p>
			</div>
			<div class="session-card card">
				<h3 class="session-title">Resume</h3>
				<p class="session-desc">
					<code>resumeSessionId</code> passed to SDK <code>query()</code>. The session picks up exactly where it left off — same conversation history. Used for <code>error_max_turns</code> retries. On these retries, <code>maxTurns</code> is escalated to 1.5× to give the agent room to finish.
				</p>
			</div>
			<div class="session-card card">
				<h3 class="session-title">Fork</h3>
				<p class="session-desc">
					<code>resumeSessionId</code> + <code>forkSession: true</code> branches the conversation. The new session shares prior context but diverges from the fork point. Used for review rejection — the agent gets reviewer feedback added to its existing context.
				</p>
			</div>
			<div class="session-card card">
				<h3 class="session-title">Checkpointing</h3>
				<p class="session-desc">
					<code>enableFileCheckpointing: true</code> tells the SDK to save file state. Checkpoint IDs captured during iteration and stored on the run record. Enables exact file state restoration on resume.
				</p>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Cancellation</h2>
		<div class="card">
			<div class="cancel-row">
				<div class="cancel-mechanism">
					<div class="cancel-title">Mechanism</div>
					<p class="cancel-desc">
						An <code>AbortController</code> is created per run and passed to the SDK's <code>query()</code> call. <code>adapter.cancel()</code> calls <code>controller.abort()</code> and closes the async iterator. The run stops immediately.
					</p>
				</div>
				<div class="cancel-triggers">
					<div class="cancel-title">Triggers</div>
					<div class="trigger-list">
						<div class="trigger-item">
							<span class="trigger-source">Timeout</span>
							<span class="trigger-desc">Run exceeds max duration configured in daemon settings</span>
						</div>
						<div class="trigger-item">
							<span class="trigger-source">Stall detection</span>
							<span class="trigger-desc">No events received for a configurable silence window</span>
						</div>
						<div class="trigger-item">
							<span class="trigger-source">Budget exceeded</span>
							<span class="trigger-desc">Daily budget check in <code>onEvent</code> detects overspend</span>
						</div>
						<div class="trigger-item">
							<span class="trigger-source">User cancel</span>
							<span class="trigger-desc">Dashboard cancel action — <code>DELETE /api/v1/tasks/:id/run</code></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Error Classification</h2>
		<div class="card">
			<p class="error-intro">
				<code>classifyError()</code> maps SDK stop reasons to Harness run outcomes, determining whether a failed run is worth retrying.
			</p>
			<div class="error-table">
				<div class="error-row header-row">
					<span>Stop reason</span>
					<span>Classification</span>
					<span>Retry?</span>
					<span>Rationale</span>
				</div>
				<div class="error-row">
					<code class="error-code">error_max_turns</code>
					<span class="error-class retriable">retriable</span>
					<span class="error-retry yes">Yes</span>
					<span class="error-why">Resuming with different context (prior run summary) may complete the work</span>
				</div>
				<div class="error-row">
					<code class="error-code">error_during_execution</code>
					<span class="error-class retriable">retriable</span>
					<span class="error-retry yes">Yes</span>
					<span class="error-why">Transient failure — might succeed on next attempt</span>
				</div>
				<div class="error-row">
					<code class="error-code">error_max_budget_usd</code>
					<span class="error-class terminal">terminal</span>
					<span class="error-retry no">No</span>
					<span class="error-why">Retrying won't reduce cost — will just hit the limit again</span>
				</div>
				<div class="error-row">
					<code class="error-code">error_max_structured_output_retries</code>
					<span class="error-class terminal">terminal</span>
					<span class="error-retry no">No</span>
					<span class="error-why">Schema mismatch — structural issue that retrying won't resolve</span>
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

	/* ── Adapter grid ───────────────────────────────────────────────────────── */
	.adapter-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.adapter-label {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cr-amber);
		margin-bottom: 6px;
	}

	.adapter-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.adapter-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Hooks list ─────────────────────────────────────────────────────────── */
	.hooks-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.hook-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.hook-type {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		padding: 3px 10px;
		border-radius: 3px;
	}

	.hook-type.pre {
		background: rgba(200, 113, 58, 0.15);
		color: var(--cr-copper);
		border: 1px solid rgba(200, 113, 58, 0.3);
	}

	.hook-type.post {
		background: rgba(232, 162, 48, 0.1);
		color: var(--cr-amber);
		border: 1px solid var(--cr-amber-dim);
	}

	.hook-type.stop {
		background: rgba(181, 74, 58, 0.12);
		color: var(--cr-ember);
		border: 1px solid rgba(181, 74, 58, 0.3);
	}

	.hook-type.worktree {
		background: rgba(90, 138, 90, 0.12);
		color: var(--cr-moss);
		border: 1px solid rgba(90, 138, 90, 0.3);
	}

	.hook-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
	}

	.hook-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.hook-action {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.action-bullet {
		color: var(--cr-amber-dim);
		flex-shrink: 0;
		line-height: 1.6;
	}

	.hook-action span:last-child {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.hook-action code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Structured flow ────────────────────────────────────────────────────── */
	.structured-flow {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.sf-step {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--cr-rule);
	}

	.sf-step:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.sf-num {
		width: 26px;
		height: 26px;
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

	.sf-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.sf-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.sf-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Session grid ───────────────────────────────────────────────────────── */
	.session-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.session-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 8px;
	}

	.session-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.session-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Cancel ─────────────────────────────────────────────────────────────── */
	.cancel-row {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 24px;
	}

	.cancel-title {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--cr-text-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 10px;
	}

	.cancel-desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.cancel-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	.trigger-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.trigger-item {
		display: flex;
		gap: 12px;
		align-items: baseline;
	}

	.trigger-source {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
		min-width: 120px;
		flex-shrink: 0;
	}

	.trigger-desc {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-mid);
	}

	/* ── Error table ────────────────────────────────────────────────────────── */
	.error-intro {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.error-intro code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	.error-table {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		overflow: hidden;
	}

	.error-row {
		display: grid;
		grid-template-columns: 280px 100px 60px 1fr;
		gap: 16px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--cr-rule);
		align-items: center;
	}

	.error-row:last-child {
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

	.error-code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text);
	}

	.error-class {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 2px 7px;
		border-radius: 3px;
		display: inline-block;
	}

	.error-class.retriable {
		background: rgba(90, 138, 90, 0.12);
		color: var(--cr-moss);
		border: 1px solid rgba(90, 138, 90, 0.3);
	}

	.error-class.terminal {
		background: rgba(181, 74, 58, 0.12);
		color: var(--cr-ember);
		border: 1px solid rgba(181, 74, 58, 0.3);
	}

	.error-retry {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
	}

	.error-retry.yes { color: var(--cr-moss); }
	.error-retry.no { color: var(--cr-ember); }

	.error-why {
		font-family: var(--font-body);
		font-size: 0.825rem;
		color: var(--cr-text-mid);
	}
</style>
