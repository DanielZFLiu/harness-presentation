<svelte:head>
	<title>Codebase Statistics — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Codebase Statistics</h1>

	<div class="headline-stats">
		<div class="stat-item">
			<span class="stat-number">11,383</span>
			<span class="stat-label">source lines</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">12,746</span>
			<span class="stat-label">test lines</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">86</span>
			<span class="stat-label">source files</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">67</span>
			<span class="stat-label">test files</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">431</span>
			<span class="stat-label">commits</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<span class="stat-number">9</span>
			<span class="stat-label">design docs</span>
		</div>
	</div>

	<section class="section">
		<h2 class="section-title">Per-Module Breakdown</h2>
		<div class="card">
			<table class="module-table">
				<thead>
					<tr>
						<th class="col-module">Module</th>
						<th class="col-num">Source Lines</th>
						<th class="col-num">Source Files</th>
						<th class="col-num">Test Lines</th>
						<th class="col-num">Test Files</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="module-name">@harness/core</td>
						<td class="num">749</td>
						<td class="num">7</td>
						<td class="num">561</td>
						<td class="num">5</td>
					</tr>
					<tr>
						<td class="module-name">@harness/store</td>
						<td class="num">623</td>
						<td class="num">7</td>
						<td class="num">1,376</td>
						<td class="num">7</td>
					</tr>
					<tr>
						<td class="module-name">@harness/workspace</td>
						<td class="num">509</td>
						<td class="num">5</td>
						<td class="num">744</td>
						<td class="num">4</td>
					</tr>
					<tr>
						<td class="module-name">@harness/agent</td>
						<td class="num">1,610</td>
						<td class="num">12</td>
						<td class="num">2,429</td>
						<td class="num">12</td>
					</tr>
					<tr>
						<td class="module-name">@harness/intake</td>
						<td class="num">407</td>
						<td class="num">7</td>
						<td class="num">653</td>
						<td class="num">4</td>
					</tr>
					<tr>
						<td class="module-name">@harness/daemon</td>
						<td class="num">3,768</td>
						<td class="num">22</td>
						<td class="num">5,776</td>
						<td class="num">23</td>
					</tr>
					<tr>
						<td class="module-name">@harness/dashboard</td>
						<td class="num">3,717</td>
						<td class="num">26</td>
						<td class="num">1,207</td>
						<td class="num">12</td>
					</tr>
					<tr class="total-row">
						<td class="module-name total">Total</td>
						<td class="num total">11,383</td>
						<td class="num total">86</td>
						<td class="num total">12,746</td>
						<td class="num total">67</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Documentation</h2>
		<div class="card">
			<div class="doc-stats">
				<div class="doc-row">
					<span class="doc-label">Design docs</span>
					<span class="doc-value">9 authored files — one per module + master architecture + visual design system</span>
				</div>
				<div class="doc-row">
					<span class="doc-label">Reference docs</span>
					<span class="doc-value">30 files — curated Agent SDK docs, articles, and external specs (not authored from scratch)</span>
				</div>
				<div class="doc-row">
					<span class="doc-label">Roadmap</span>
					<span class="doc-value">Detailed plan from v3.0 through v4 with future extensions</span>
				</div>
				<div class="doc-row">
					<span class="doc-label">Other</span>
					<span class="doc-value">Changelog, code style guide, commit conventions</span>
				</div>
				<div class="doc-row">
					<span class="doc-label">Total</span>
					<span class="doc-value">~19,600 lines across 42 markdown files</span>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Test Philosophy</h2>
		<div class="card card--accent">
			<p class="philosophy-text">
				Store tests hit real in-memory SQLite. Agent tests inject mock query factories. No mocking of external boundaries — real databases, real git operations.
			</p>
		</div>
		<div class="philosophy-grid">
			<div class="card">
				<h3 class="card-heading">Real Boundaries</h3>
				<p class="card-body">
					SQLite is not mocked. Tests spin up an in-memory database and run against real SQL, real migrations, real UPSERT semantics. If the schema changes, tests break.
				</p>
			</div>
			<div class="card">
				<h3 class="card-heading">Injected Seams</h3>
				<p class="card-body">
					Agent tests don't call the Claude API. Query factories are injected, allowing tests to feed exact message sequences and verify event emission, cost tracking, and retry logic.
				</p>
			</div>
			<div class="card">
				<h3 class="card-heading">Behavior Coverage</h3>
				<p class="card-body">
					Every test is written to detect regressions on the specific feature it covers. If the feature breaks, the test fails — not as a side effect, but by design.
				</p>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Test-to-Source Ratio by Module</h2>
		<div class="card">
			<div class="ratio-bars">
				{#each [
					{ name: '@harness/core', src: 749, test: 561 },
					{ name: '@harness/store', src: 623, test: 1376 },
					{ name: '@harness/workspace', src: 509, test: 744 },
					{ name: '@harness/agent', src: 1610, test: 2429 },
					{ name: '@harness/intake', src: 407, test: 653 },
					{ name: '@harness/daemon', src: 3768, test: 5776 },
					{ name: '@harness/dashboard', src: 3717, test: 1207 },
				] as m}
					{@const ratio = (m.test / m.src).toFixed(2)}
					{@const maxRatio = 2.0}
					{@const barWidth = Math.min((m.test / m.src) / maxRatio * 100, 100)}
					<div class="ratio-row">
						<span class="ratio-name">{m.name}</span>
						<div class="ratio-bar-track">
							<div class="ratio-bar-fill" style="width: {barWidth}%"></div>
						</div>
						<span class="ratio-value">{ratio}x</span>
					</div>
				{/each}
			</div>
			<p class="table-note">Test lines ÷ source lines. Daemon and agent have the highest coverage density.</p>
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
		margin-bottom: 32px;
	}

	/* ── Headline stats ─────────────────────────────────────────────────────── */
	.headline-stats {
		display: flex;
		align-items: center;
		gap: 0;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 28px 32px;
		margin-bottom: 48px;
		flex-wrap: wrap;
		gap: 16px;
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
		font-size: 1.75rem;
		font-weight: 500;
		color: var(--cr-amber);
		line-height: 1;
	}

	.stat-label {
		font-family: var(--font-body);
		font-size: 0.8rem;
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

	/* ── Sections ───────────────────────────────────────────────────────────── */
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

	.card-heading {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 8px;
	}

	.card-body {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	/* ── Table ──────────────────────────────────────────────────────────────── */
	.module-table {
		width: 100%;
		border-collapse: collapse;
	}

	.module-table thead tr {
		border-bottom: 2px solid var(--cr-amber-dim);
	}

	.module-table th {
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-text-dim);
		padding: 0 12px 12px 0;
		text-align: left;
	}

	.module-table th.col-num,
	.module-table td.num {
		text-align: right;
	}

	.module-table tbody tr {
		border-bottom: 1px solid var(--cr-rule);
	}

	.module-table tbody tr:last-child {
		border-bottom: none;
	}

	.module-table td {
		padding: 10px 12px 10px 0;
	}

	.module-name {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--cr-text-mid);
	}

	.num {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--cr-text);
	}

	.total-row {
		border-top: 2px solid var(--cr-rule-bright) !important;
	}

	.total-row .module-name.total,
	.total-row .num.total {
		color: var(--cr-amber);
		font-weight: 500;
	}

	.table-note {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		margin-top: 16px;
		line-height: 1.5;
	}

	/* ── Documentation ─────────────────────────────────────────────────────── */
	.doc-stats {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.doc-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--cr-rule);
	}

	.doc-row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.doc-label {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--cr-amber);
		flex-shrink: 0;
	}

	.doc-value {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-mid);
		text-align: right;
	}

	/* ── Philosophy grid ────────────────────────────────────────────────────── */
	.philosophy-text {
		font-family: var(--font-body);
		font-size: 1.05rem;
		color: var(--cr-text);
		line-height: 1.7;
		font-style: italic;
	}

	.philosophy-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
		margin-top: 16px;
	}

	/* ── Ratio bars ─────────────────────────────────────────────────────────── */
	.ratio-bars {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.ratio-row {
		display: grid;
		grid-template-columns: 160px 1fr 48px;
		align-items: center;
		gap: 16px;
	}

	.ratio-name {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-mid);
	}

	.ratio-bar-track {
		height: 8px;
		background: var(--cr-rule);
		border-radius: 4px;
		overflow: hidden;
	}

	.ratio-bar-fill {
		height: 100%;
		background: var(--cr-amber);
		border-radius: 4px;
		opacity: 0.7;
	}

	.ratio-value {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-amber);
		text-align: right;
	}
</style>
