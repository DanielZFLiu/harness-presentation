<script>
	import Slide from '$lib/Slide.svelte';
	import VideoPlayer from '$lib/VideoPlayer.svelte';
</script>

<Slide centered noNumber>
	<h1 class="reveal-title">Remember the game?</h1>

	<div class="video-wrap">
		<VideoPlayer src="/videos/game-demo.mp4" />
	</div>
</Slide>

<style>
	.reveal-title {
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--cr-text);
		margin-bottom: 8px;
	}

	.video-wrap {
		width: 100%;
		max-width: 640px;
		margin: 0 auto 32px;
	}

	.closing {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--cr-amber);
	}
</style>
