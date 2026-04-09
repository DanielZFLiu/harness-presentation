<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		before: Snippet;
		after: Snippet;
	}

	let { before, after }: Props = $props();
</script>

<div class="before-after">
	<div class="ba-panel">
		{@render before()}
	</div>
	<div class="ba-arrow">&#8594;</div>
	<div class="ba-panel">
		{@render after()}
	</div>
</div>

<style>
	.before-after {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 20px;
		align-items: center;
	}

	.ba-arrow {
		color: var(--cr-amber);
		font-size: 1.5rem;
	}

	.ba-panel { min-width: 0; }
</style>
