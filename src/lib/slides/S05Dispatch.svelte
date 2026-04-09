<script>
	import Slide from '$lib/Slide.svelte';
	import VideoPlayer from '$lib/VideoPlayer.svelte';
</script>

<Slide number={5} total={16}>
	<p class="section-label">Demo</p>
	<h1 class="slide-title">Harness takes over</h1>
	<p class="slide-subtitle">Task moves to ready — daemon claims it, provisions a git worktree, dispatches the agent, events stream in real-time.</p>

	<VideoPlayer src="/videos/full-lifecycle.mp4" />
</Slide>
