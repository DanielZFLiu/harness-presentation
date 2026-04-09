<script lang="ts">
	interface Props {
		src: string;
		caption?: string;
	}

	let { src, caption }: Props = $props();
	let started = $state(false);
	let videoEl: HTMLVideoElement | undefined = $state();

	function start() {
		if (!videoEl) return;
		videoEl.play();
		started = true;
	}

	function onEnded() {
		started = false;
	}
</script>

<div class="video-container" class:playing={started}>
	<video bind:this={videoEl} {src} onended={onEnded} preload="metadata" controls={started}>
		<track kind="captions" />
	</video>
	{#if !started}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="play-overlay" onclick={start}>
			<div class="play-icon">&#9654;</div>
		</div>
	{/if}
	{#if caption}
		<div class="video-caption">{caption}</div>
	{/if}
</div>

<style>
	.video-container {
		border: 2px solid var(--cr-amber-dim);
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		background: var(--cr-bg);
		transition: border-color 0.3s ease, box-shadow 0.5s ease;
	}

	.video-container.playing {
		border-color: var(--cr-amber);
		box-shadow: 0 0 30px rgba(232, 162, 48, 0.12);
	}

	video {
		width: 100%;
		max-height: calc(100vh - 300px);
		object-fit: contain;
		display: block;
	}

	.play-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(12, 10, 8, 0.4);
		cursor: pointer;
	}

	.play-icon {
		font-size: 2.5rem;
		color: var(--cr-amber);
		filter: drop-shadow(0 0 12px rgba(232, 162, 48, 0.3));
	}

	.video-caption {
		padding: 8px 16px;
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		border-top: 1px solid var(--cr-rule);
	}
</style>
