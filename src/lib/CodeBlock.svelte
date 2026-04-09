<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<pre class="code-block">{@render children()}</pre>

<style>
	.code-block {
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		padding: 20px 24px;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--cr-text-mid);
		overflow-x: auto;
		white-space: pre;
	}

	.code-block :global(.key)     { color: var(--cr-amber); }
	.code-block :global(.str)     { color: var(--cr-moss); }
	.code-block :global(.num)     { color: var(--cr-copper); }
	.code-block :global(.comment) { color: var(--cr-text-dim); }
</style>
