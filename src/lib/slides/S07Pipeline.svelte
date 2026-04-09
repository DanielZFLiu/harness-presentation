<script>
	import Slide from '$lib/Slide.svelte';
	import VideoPlayer from '$lib/VideoPlayer.svelte';
</script>

<Slide number={7} total={16}>
	<p class="section-label">Demo</p>
	<h1 class="slide-title">Agents review their own work</h1>
	<p class="slide-subtitle">Generator writes code → evaluator reviews the diff → rejects with feedback → generator retries → evaluator approves. All automatic.</p>

	<VideoPlayer src="/videos/gen-eval-pipeline.mp4" />
</Slide>
