<svelte:head>
	<title>Database Schema Evolution — Harness Appendix</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">Database Schema Evolution</h1>
	<p class="page-subtitle">
		Nine migrations across seven versions — each one tracking a capability added to the system.
	</p>

	<div class="meta-row">
		<div class="meta-item">
			<span class="meta-label">Location</span>
			<code class="meta-val">modules/store/migrations/</code>
		</div>
		<div class="meta-item">
			<span class="meta-label">Tracking</span>
			<code class="meta-val">PRAGMA user_version</code>
		</div>
		<div class="meta-item">
			<span class="meta-label">Mode</span>
			<code class="meta-val">WAL</code>
		</div>
		<div class="meta-item">
			<span class="meta-label">Safety</span>
			<code class="meta-val">Each migration in a transaction</code>
		</div>
	</div>

	<div class="migration-list">
		{#each [
			{ num: '001', ver: 'v1.0', label: 'vertical slice', title: 'Initial tables', changes: [
				{ type: 'TABLE', name: 'tasks, runs, events' },
				{ type: 'INDEX', name: 'on status, parent_id, task_id' }
			]},
			{ num: '002', ver: 'v2.0', label: 'customizability', title: 'Per-task branch override', changes: [
				{ type: 'COL', name: 'tasks.base_branch' }
			]},
			{ num: '003', ver: 'v2.0', label: 'cost guardrails', title: 'Daily cost tracking', changes: [
				{ type: 'TABLE', name: 'daily_costs', note: 'UPSERT-based atomic accumulation' }
			]},
			{ num: '004', ver: 'v2.1', label: 'profiles & SDK', title: 'Named profiles + session resume', changes: [
				{ type: 'COL', name: 'runs.agent_profile' },
				{ type: 'COL', name: 'runs.session_id' },
				{ type: 'COL', name: 'runs.checkpoint_id' }
			]},
			{ num: '005', ver: 'v2.1.1', label: 'sequential execution', title: 'Auto-approve flag', changes: [
				{ type: 'COL', name: 'tasks.auto_approve' }
			]},
			{ num: '006', ver: 'v2.2', label: 'observability', title: 'Run detail expansion', changes: [
				{ type: 'COL', name: 'runs.num_turns, stop_reason, model_usage' }
			]},
			{ num: '007', ver: 'v2.2', label: 'quality of life', title: 'Soft delete', changes: [
				{ type: 'COL', name: 'tasks.deleted_at' }
			]},
			{ num: '008', ver: 'v2.4', label: 'agent review', title: 'Separate coding vs review runs', changes: [
				{ type: 'COL', name: 'tasks.reviewer_profile' },
				{ type: 'COL', name: 'runs.run_type' }
			]},
			{ num: '009', ver: 'v3.0', label: 'pipelines', title: 'Gen/eval pipeline tracking', changes: [
				{ type: 'COL', name: 'runs.pipeline_role' },
				{ type: 'COL', name: 'runs.pipeline_iteration' }
			]}
		] as m, i}
			<div class="migration" class:migration--last={i === 8}>
				<div class="mig-rail">
					<div class="mig-dot"></div>
					{#if i < 8}<div class="mig-line"></div>{/if}
				</div>
				<div class="mig-content">
					<div class="mig-header">
						<span class="mig-num">{m.num}</span>
						<span class="mig-ver">{m.ver}</span>
						<span class="mig-label">{m.label}</span>
					</div>
					<div class="mig-title">{m.title}</div>
					<div class="mig-changes">
						{#each m.changes as c}
							<span class="change">
								<span class="change-type" class:change-type--table={c.type === 'TABLE'} class:change-type--col={c.type === 'COL'} class:change-type--idx={c.type === 'INDEX'}>{c.type}</span>
								<code>{c.name}</code>
								{#if c.note}<span class="change-note">— {c.note}</span>{/if}
							</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<section class="notes-section">
		<h2 class="section-title">Migration Invariants</h2>
		<div class="notes-grid">
			<div class="card">
				<h3 class="note-title">Nullable columns only</h3>
				<p class="note-desc">All <code>ALTER TABLE</code> columns are nullable. SQLite requires it — ensures migrations never fail on populated tables.</p>
			</div>
			<div class="card">
				<h3 class="note-title">Transactional</h3>
				<p class="note-desc">Each migration runs in a transaction. Failure rolls back everything. <code>user_version</code> only incremented on success.</p>
			</div>
		</div>
	</section>
</div>

<style>
	.page { padding-bottom: 48px; }

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
		margin-bottom: 24px;
	}

	.meta-row {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		margin-bottom: 36px;
		padding: 14px 20px;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
	}

	.meta-item { display: flex; align-items: center; gap: 8px; }
	.meta-label { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cr-text-dim); }
	.meta-val { font-family: var(--font-mono); font-size: 0.8rem; color: var(--cr-amber); }

	/* ── Migration list ────────────────────────────────────────────────────── */
	.migration-list {
		display: flex;
		flex-direction: column;
		margin-bottom: 48px;
	}

	.migration {
		display: flex;
		gap: 16px;
	}

	.mig-rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 14px;
		flex-shrink: 0;
	}

	.mig-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--cr-surface-alt);
		border: 2px solid var(--cr-amber-dim);
		flex-shrink: 0;
		margin-top: 6px;
	}

	.migration--last .mig-dot {
		border-color: var(--cr-amber);
		background: var(--cr-amber);
	}

	.mig-line {
		width: 2px;
		flex: 1;
		background: var(--cr-rule-bright);
	}

	.mig-content {
		flex: 1;
		padding-bottom: 20px;
	}

	.mig-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
	}

	.mig-num {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--cr-text-dim);
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		padding: 1px 6px;
		border-radius: 3px;
	}

	.mig-ver {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--cr-bg);
		background: var(--cr-moss);
		padding: 1px 6px;
		border-radius: 3px;
		text-transform: uppercase;
	}

	.mig-label {
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		font-style: italic;
	}

	.mig-title {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.mig-changes {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.change {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: 0.85rem;
	}

	.change-type {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 1px 5px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.change-type--table { background: rgba(90, 138, 90, 0.15); color: var(--cr-moss); border: 1px solid rgba(90, 138, 90, 0.3); }
	.change-type--col { background: rgba(232, 162, 48, 0.1); color: var(--cr-amber); border: 1px solid var(--cr-amber-dim); }
	.change-type--idx { background: rgba(200, 113, 58, 0.12); color: var(--cr-copper); border: 1px solid rgba(200, 113, 58, 0.3); }

	.change code { font-family: var(--font-mono); font-size: 0.825rem; color: var(--cr-text); }
	.change-note { font-family: var(--font-body); font-size: 0.8rem; color: var(--cr-text-dim); }

	/* ── Notes ──────────────────────────────────────────────────────────────── */
	.notes-section { margin-bottom: 0; }
	.section-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--cr-text); margin-bottom: 16px; }
	.notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
	.card { background: var(--cr-surface); border: 1px solid var(--cr-rule); border-radius: 6px; padding: 20px 24px; }
	.note-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; color: var(--cr-text); margin-bottom: 8px; }
	.note-desc { font-family: var(--font-body); font-size: 0.85rem; color: var(--cr-text-mid); line-height: 1.6; }
	.note-desc code { font-family: var(--font-mono); font-size: 0.8rem; color: var(--cr-amber); }
</style>
