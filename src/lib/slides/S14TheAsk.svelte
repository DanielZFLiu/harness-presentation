<script>
	import Slide from '$lib/Slide.svelte';
</script>

<Slide number={14} total={16}>
	<div class="ask-content">
		<h1 class="ask-title">The infrastructure is ready.</h1>
		<div class="ask-stats">
			<span class="stat">7 modules</span>
			<span class="sep">&middot;</span>
			<span class="stat">719 tests</span>
			<span class="sep">&middot;</span>
			<span class="stat">e2e coverage</span>
			<span class="sep">&middot;</span>
			<span class="stat">v3.0 shipped</span>
			<span class="sep">&middot;</span>
			<span class="stat">roadmap through v4</span>
		</div>
	</div>
</Slide>

<style>
	.ask-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
	}

	.ask-title {
		font-family: var(--font-display);
		font-size: 3rem;
		font-weight: 800;
		color: var(--cr-text);
		letter-spacing: -0.02em;
	}

	.ask-sub {
		font-family: var(--font-body);
		font-size: 1.25rem;
		color: var(--cr-text-mid);
	}

	.ask-stats {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 16px;
	}

	.stat {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--cr-amber);
	}

	.sep {
		color: var(--cr-text-dim);
	}
</style>
