<script>
	import Slide from '$lib/Slide.svelte';
	import BeforeAfter from '$lib/BeforeAfter.svelte';
	import Screenshot from '$lib/Screenshot.svelte';
</script>

<Slide number={4} total={16}>
	<p class="section-label">Demo</p>
	<h1 class="slide-title">Feed it a game specification</h1>
	<p class="slide-subtitle">Harness's intake module decomposes raw requirements into structured tasks with priorities.</p>

	<BeforeAfter>
		{#snippet before()}
			<div class="label-above">Raw Spec</div>
			<Screenshot src="/screenshots/intake-before.png" alt="Raw game spec markdown" />
		{/snippet}
		{#snippet after()}
			<div class="label-above">Structured Tasks</div>
			<Screenshot src="/screenshots/intake-after.png" alt="Decomposed tasks in dashboard" />
		{/snippet}
	</BeforeAfter>
</Slide>

<style>
	.label-above {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-amber);
		margin-bottom: 8px;
	}
</style>
