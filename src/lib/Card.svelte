<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'accent' | 'highlight';
		children: Snippet;
	}

	let { variant = 'default', children }: Props = $props();
</script>

<div class="card card--{variant}">
	{@render children()}
</div>

<style>
	.card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 20px 24px;
	}

	.card--accent {
		border-left: 3px solid var(--cr-amber);
	}

	.card--highlight {
		background: var(--cr-surface-alt);
		border-color: var(--cr-amber-dim);
	}

	.card :global(h3) {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.card :global(p) {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.card :global(.card-label) {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--cr-amber);
		margin-bottom: 6px;
	}
</style>
