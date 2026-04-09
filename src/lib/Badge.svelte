<script lang="ts">
	interface Props {
		variant?: 'shipped' | 'next' | 'planned' | 'vision' | 'auto' | 'agent' | 'human';
		children: import('svelte').Snippet;
	}

	let { variant = 'shipped', children }: Props = $props();
</script>

<span class="badge badge--{variant}">
	{@render children()}
</span>

<style>
	.badge {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 3px 10px;
		border-radius: 3px;
		display: inline-block;
	}

	.badge--shipped { background: var(--cr-moss);     color: var(--cr-bg); }
	.badge--next    { background: var(--cr-amber);     color: var(--cr-bg); }
	.badge--planned { background: var(--cr-text-dim);  color: var(--cr-bg); }
	.badge--vision  { background: var(--cr-copper);    color: var(--cr-bg); }
	.badge--auto    { background: var(--cr-moss);      color: var(--cr-bg); }
	.badge--agent   { background: var(--cr-copper);    color: var(--cr-bg); }
	.badge--human   { background: var(--cr-amber);     color: var(--cr-bg); }
</style>
