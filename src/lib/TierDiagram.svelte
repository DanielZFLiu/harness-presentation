<script lang="ts">
	const modules: Record<string, string> = {
		'@harness/core': 'Types, interfaces, state machine — zero implementation code',
		'@harness/store': 'SQLite persistence — tasks, runs, events, costs',
		'@harness/workspace': 'Git worktree provisioning and branch management',
		'@harness/agent': 'Claude Agent SDK adapter — prompts, hooks, cost tracking',
		'@harness/intake': 'LLM-powered requirements decomposition',
		'@harness/daemon': '24/7 orchestration — polling, dispatch, retry, API',
		'@harness/dashboard': 'SvelteKit operator UI — task management, monitoring, review'
	};

	let hovered = $state<string | null>(null);

	const defaultDesc = 'Modules depend on interfaces from @harness/core, never on each other\'s internals. 662 tests across all modules.';
</script>

<div class="tier-wrapper">
	<div class="tier">
		<div class="tier-level">
			<span class="tier-label">Tier 0 — Contracts</span>
			<div class="tier-row">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="tier-module" onmouseenter={() => hovered = '@harness/core'} onmouseleave={() => hovered = null}>@harness/core</div>
			</div>
		</div>
		<div class="tier-connector"></div>
		<div class="tier-level">
			<span class="tier-label">Tier 1 — Independent Services</span>
			<div class="tier-row">
				{#each ['@harness/store', '@harness/workspace', '@harness/agent', '@harness/intake'] as mod}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="tier-module" class:tier-module--active={hovered === mod} onmouseenter={() => hovered = mod} onmouseleave={() => hovered = null}>{mod}</div>
				{/each}
			</div>
		</div>
		<div class="tier-connector"></div>
		<div class="tier-level">
			<span class="tier-label">Tier 2 — Orchestration</span>
			<div class="tier-row">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="tier-module" onmouseenter={() => hovered = '@harness/daemon'} onmouseleave={() => hovered = null}>@harness/daemon</div>
			</div>
		</div>
		<div class="tier-connector"></div>
		<div class="tier-level">
			<span class="tier-label">Tier 3 — Interface</span>
			<div class="tier-row">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="tier-module" onmouseenter={() => hovered = '@harness/dashboard'} onmouseleave={() => hovered = null}>@harness/dashboard</div>
			</div>
		</div>
	</div>

	<div class="tier-desc" class:tier-desc--active={hovered !== null}>
		{#if hovered}
			<span class="tier-desc-name">{hovered}</span> — {modules[hovered]}
		{:else}
			{defaultDesc}
		{/if}
	</div>
</div>

<style>
	.tier-wrapper { display: flex; flex-direction: column; gap: 32px; }
	.tier { display: flex; flex-direction: column; align-items: center; gap: 0; }
	.tier-level { display: flex; flex-direction: column; align-items: center; gap: 8px; }
	.tier-label { font-family: var(--font-display); font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--cr-text-dim); }
	.tier-row { display: flex; gap: 12px; justify-content: center; }

	.tier-module {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		padding: 10px 18px;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		color: var(--cr-text-mid);
		cursor: default;
		transition: border-color 0.2s ease, color 0.2s ease;
	}

	.tier-module:hover, .tier-module--active {
		border-color: var(--cr-amber);
		color: var(--cr-amber);
	}

	.tier-connector { width: 2px; height: 14px; background: var(--cr-rule-bright); margin: 4px auto; }

	.tier-desc {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-dim);
		text-align: center;
		min-height: 2.4em;
		transition: color 0.2s ease;
	}

	.tier-desc--active { color: var(--cr-text-mid); }
	.tier-desc-name { font-family: var(--font-mono); color: var(--cr-amber); font-size: 0.8rem; }
</style>
