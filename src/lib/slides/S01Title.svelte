<script>
	import Slide from '$lib/Slide.svelte';
</script>

<Slide centered noNumber>
	<div class="title-block">
		<h1 class="title">Harness</h1>
		<div class="rule"></div>
		<p class="tagline">Always-On AI Agent Orchestration</p>
	</div>
</Slide>

<style>
	.title-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.title {
		font-family: var(--font-display);
		font-size: 4rem;
		font-weight: 800;
		color: var(--cr-text);
		letter-spacing: -0.02em;
	}

	.rule {
		width: 120px;
		height: 2px;
		background: var(--cr-amber);
		margin: 16px 0;
	}

	.tagline {
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--cr-text-mid);
		margin-bottom: 32px;
	}

	.meta {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 300;
		color: var(--cr-text-dim);
	}
</style>
