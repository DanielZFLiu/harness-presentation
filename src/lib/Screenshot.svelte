<script lang="ts">
	interface Props {
		src: string;
		alt?: string;
	}

	let { src, alt = '' }: Props = $props();
</script>

<div class="screenshot">
	<img {src} {alt} />
</div>

<style>
	.screenshot {
		border: 1px solid var(--cr-rule-bright);
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
	}

	img { width: 100%; display: block; }
</style>
