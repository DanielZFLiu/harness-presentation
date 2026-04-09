<script>
	import Slide from '$lib/Slide.svelte';
	import TierDiagram from '$lib/TierDiagram.svelte';
</script>

<Slide number={9} total={16}>
	<p class="section-label">Architecture</p>
	<h1 class="slide-title">Seven modules, tiered dependencies, clean contracts</h1>

	<div style="margin: 40px 0;">
		<TierDiagram />
	</div>
</Slide>
