<script lang="ts">
	interface Props {
		progress: number;
	}

	let { progress }: Props = $props();
</script>

<div class="progress-bar">
	<div class="progress-fill" style="width: {progress * 100}%"></div>
</div>

<style>
	.progress-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--cr-rule);
		z-index: 100;
	}

	.progress-fill {
		height: 100%;
		background: var(--cr-amber);
		transition: width 0.3s ease;
	}
</style>
