<script>
	const sseWireFormat = `event: agent:event\ndata: {"kind":"assistant","content":"..."}\n\nevent: task:transition\ndata: {"taskId":"...","status":"review"}`;
</script>

<svelte:head>
	<title>Real-time Streaming Architecture — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Real-time Streaming Architecture</h1>
	<p class="page-subtitle">
		Agent output travels from the Claude SDK through six transformation stages before reaching the dashboard — each stage typed, each boundary explicit.
	</p>

	<div class="pipeline">

		<!-- Stage 1 -->
		<div class="stage">
			<div class="stage-header">
				<span class="stage-num">01</span>
				<h2 class="stage-title">SDK Messages</h2>
			</div>
			<div class="stage-body card">
				<div class="stage-meta">
					<span class="meta-label">Source</span>
					<code class="meta-value">@anthropic-ai/claude-agent-sdk</code>
				</div>
				<p class="stage-desc">Raw message stream from the Claude agent process. The SDK yields an async iterable of typed messages.</p>
				<div class="tag-row">
					<span class="tag">AssistantMessage</span>
					<span class="tag">ResultMessage</span>
					<span class="tag">SystemMessage</span>
					<span class="tag">UserMessage</span>
					<span class="tag">RateLimitEvent</span>
				</div>
			</div>
		</div>

		<div class="pipe-arrow">↓</div>

		<!-- Stage 2 -->
		<div class="stage">
			<div class="stage-header">
				<span class="stage-num">02</span>
				<h2 class="stage-title">Message Mapping</h2>
			</div>
			<div class="stage-body card">
				<p class="stage-desc">
					Two parallel paths both produce <code>AgentEvent</code> objects, but through different mechanisms.
				</p>
				<div class="transform-row">
					<div class="transform-item">
						<span class="transform-in path-label">Path A — message-mapper.ts</span>
					</div>
					<div class="transform-item">
						<span class="transform-in"><code>mapSdkMessage()</code> handles the SDK message stream</span>
					</div>
					<div class="transform-item">
						<span class="transform-in">AssistantMessage</span>
						<span class="transform-arrow">→</span>
						<span class="transform-out">assistant event</span>
					</div>
					<div class="transform-item">
						<span class="transform-in">ResultMessage</span>
						<span class="transform-arrow">→</span>
						<span class="transform-out">cost event</span>
					</div>
				</div>
				<div class="transform-row" style="margin-top: 12px;">
					<div class="transform-item">
						<span class="transform-in path-label">Path B — claude-adapter.ts</span>
					</div>
					<div class="transform-item">
						<span class="transform-in">PreToolUse / PostToolUse hooks handle tool lifecycle</span>
					</div>
					<div class="transform-item">
						<span class="transform-in">PreToolUse hook</span>
						<span class="transform-arrow">→</span>
						<span class="transform-out">tool_start + timing</span>
					</div>
					<div class="transform-item">
						<span class="transform-in">PostToolUse hook</span>
						<span class="transform-arrow">→</span>
						<span class="transform-out">tool_stop + duration</span>
					</div>
				</div>
			</div>
		</div>

		<div class="pipe-arrow">↓</div>

		<!-- Stage 3 -->
		<div class="stage">
			<div class="stage-header">
				<span class="stage-num">03</span>
				<h2 class="stage-title">onEvent Callback</h2>
			</div>
			<div class="stage-body card">
				<div class="stage-meta">
					<span class="meta-label">File</span>
					<code class="meta-value">modules/daemon/src/dispatcher.ts</code>
					<span class="meta-fn">lines 466–509</span>
				</div>
				<p class="stage-desc">Three things happen per event arriving from the adapter:</p>
				<div class="three-col">
					<div class="col-item">
						<div class="col-icon amber">1</div>
						<div class="col-text">
							<strong>Persisted</strong><br>
							Stored to EventStore (SQLite) for historical replay and task detail views.
						</div>
					</div>
					<div class="col-item">
						<div class="col-icon copper">2</div>
						<div class="col-text">
							<strong>Emitted</strong><br>
							Published to DaemonEventBus for SSE fan-out to connected dashboard clients.
						</div>
					</div>
					<div class="col-item">
						<div class="col-icon moss">3</div>
						<div class="col-text">
							<strong>Special handling</strong><br>
							Questions trigger pending-question tracking. Rate limit events pause dispatch. Cost events update CostTracker.
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="pipe-arrow">↓</div>

		<!-- Stage 4 -->
		<div class="stage">
			<div class="stage-header">
				<span class="stage-num">04</span>
				<h2 class="stage-title">Event Bus</h2>
			</div>
			<div class="stage-body card">
				<div class="stage-meta">
					<span class="meta-label">File</span>
					<code class="meta-value">modules/daemon/src/event-bus.ts</code>
				</div>
				<p class="stage-desc">
					Typed pub/sub inside the daemon process. Handlers are registered by event kind — the discriminated union ensures a <code>task:transition</code> handler never receives an <code>agent:event</code> payload.
				</p>
				<div class="tag-row">
					<span class="tag amber-tag">task:transition</span>
					<span class="tag amber-tag">run:update</span>
					<span class="tag amber-tag">agent:event</span>
					<span class="tag amber-tag">system:health</span>
				</div>
			</div>
		</div>

		<div class="pipe-arrow">↓</div>

		<!-- Stage 5 -->
		<div class="stage">
			<div class="stage-header">
				<span class="stage-num">05</span>
				<h2 class="stage-title">SSE Endpoint</h2>
			</div>
			<div class="stage-body card">
				<div class="stage-meta">
					<span class="meta-label">File</span>
					<code class="meta-value">modules/daemon/src/sse.ts</code>
				</div>
				<div class="sse-detail">
					<div class="sse-route">
						<span class="meta-label">Route</span>
						<code>GET /api/v1/events/stream?taskId=</code>
					</div>
					<div class="sse-format">
						<span class="meta-label">Wire format</span>
						<pre class="code-block">{sseWireFormat}</pre>
					</div>
				</div>
				<p class="stage-desc filter-note">
					Filter policy: <span class="inline-ok">agent:event</span>, <span class="inline-ok">task:transition</span>, <span class="inline-ok">run:update</span> are forwarded to clients.
					<span class="inline-suppress">system:health</span> is suppressed — internal only.
				</p>
			</div>
		</div>

		<div class="pipe-arrow">↓</div>

		<!-- Stage 6 -->
		<div class="stage">
			<div class="stage-header">
				<span class="stage-num">06</span>
				<h2 class="stage-title">Dashboard</h2>
			</div>
			<div class="stage-body card">
				<div class="stage-meta">
					<span class="meta-label">File</span>
					<code class="meta-value">modules/dashboard/src/routes/+layout.svelte</code>
				</div>
				<p class="stage-desc">A single <code>EventSource</code> connection at the layout level serves the entire dashboard. The connection is shared — one client, one stream.</p>
				<div class="dashboard-behaviors">
					<div class="behavior-item">
						<span class="behavior-trigger">task:transition</span>
						<span class="behavior-action">→ invalidateAll() — refreshes all SvelteKit load functions to reflect new task state</span>
					</div>
					<div class="behavior-item">
						<span class="behavior-trigger">agent:event</span>
						<span class="behavior-action">→ appended to live event list on task detail page in real time</span>
					</div>
					<div class="behavior-item">
						<span class="behavior-trigger">question event</span>
						<span class="behavior-action">→ amber badge in nav bar links directly to the waiting task</span>
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
		margin-bottom: 40px;
	}

	/* ── Pipeline ───────────────────────────────────────────────────────────── */
	.pipeline {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.pipe-arrow {
		font-size: 1.5rem;
		color: var(--cr-amber-dim);
		text-align: center;
		padding: 8px 0;
		line-height: 1;
	}

	/* ── Stage ──────────────────────────────────────────────────────────────── */
	.stage-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
	}

	.stage-num {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--cr-amber);
		background: rgba(232, 162, 48, 0.12);
		padding: 3px 8px;
		border-radius: 3px;
		letter-spacing: 0.05em;
	}

	.stage-title {
		font-family: var(--font-display);
		font-size: 1.15rem;
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

	.stage-body {
		border-left: 3px solid var(--cr-rule-bright);
	}

	/* ── Meta ───────────────────────────────────────────────────────────────── */
	.stage-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 12px;
		flex-wrap: wrap;
	}

	.meta-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cr-text-dim);
	}

	.meta-value {
		font-family: var(--font-mono);
		font-size: 0.825rem;
		color: var(--cr-amber);
		background: rgba(232, 162, 48, 0.08);
		padding: 2px 6px;
		border-radius: 3px;
	}

	.meta-fn {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-copper);
	}

	/* ── Stage description ──────────────────────────────────────────────────── */
	.stage-desc {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		margin-bottom: 14px;
	}

	.stage-desc code {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
	}

	/* ── Tags ───────────────────────────────────────────────────────────────── */
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--cr-text-mid);
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		padding: 3px 10px;
		border-radius: 3px;
	}

	.amber-tag {
		color: var(--cr-amber);
		border-color: var(--cr-amber-dim);
		background: rgba(232, 162, 48, 0.08);
	}

	/* ── Transform rows ─────────────────────────────────────────────────────── */
	.transform-row {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.transform-item {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.transform-in {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-mid);
		min-width: 160px;
	}

	.transform-arrow {
		color: var(--cr-amber-dim);
		font-size: 0.9rem;
	}

	.transform-out {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-moss);
	}

	/* ── Three col ──────────────────────────────────────────────────────────── */
	.three-col {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
	}

	.col-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.col-icon {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--cr-bg);
	}

	.col-icon.amber { background: var(--cr-amber); }
	.col-icon.copper { background: var(--cr-copper); }
	.col-icon.moss { background: var(--cr-moss); }

	.col-text {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}

	.col-text strong {
		color: var(--cr-text);
		display: block;
		margin-bottom: 4px;
	}

	/* ── SSE detail ─────────────────────────────────────────────────────────── */
	.sse-detail {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 12px;
	}

	.sse-route {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.sse-route code {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--cr-amber);
	}

	.code-block {
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		padding: 14px 16px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.7;
		color: var(--cr-text-mid);
		margin: 8px 0 0;
		overflow-x: auto;
	}

	.filter-note {
		margin-bottom: 0;
	}

	.inline-ok {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-moss);
	}

	.inline-suppress {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-ember);
	}

	/* ── Dashboard behaviors ────────────────────────────────────────────────── */
	.dashboard-behaviors {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.behavior-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}

	.behavior-trigger {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
		background: rgba(232, 162, 48, 0.08);
		border: 1px solid var(--cr-amber-dim);
		padding: 3px 8px;
		border-radius: 3px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.behavior-action {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
		padding-top: 2px;
	}
</style>
