<script lang="ts">
	import { type Snippet } from 'svelte';

	interface TimelineItem {
		version: string;
		status: 'shipped' | 'next' | 'planned' | 'vision';
		title: string;
		description: string;
	}

	interface Props {
		items: TimelineItem[];
		footer?: Snippet;
	}

	let { items, footer }: Props = $props();

	const borderColors: Record<string, string> = {
		shipped: 'var(--cr-moss)', next: 'var(--cr-amber)',
		planned: 'var(--cr-text-dim)', vision: 'var(--cr-copper)'
	};

	const statusLabels: Record<string, string> = {
		shipped: 'SHIPPED', next: 'NEXT', planned: 'PLANNED', vision: 'VISION'
	};
</script>

<div class="timeline">
	{#each items as item}
		<div class="timeline-item" style="border-left-color: {borderColors[item.status]}">
			<div class="timeline-header">
				<span class="timeline-version" style="background: {borderColors[item.status]}; color: var(--cr-bg);">{item.version}</span>
				<span class="timeline-status" style="color: {borderColors[item.status]}">{statusLabels[item.status]}</span>
			</div>
			<div class="timeline-title">{item.title}</div>
			<div class="timeline-desc">{item.description}</div>
		</div>
	{/each}
</div>
{#if footer}
	<div class="timeline-footer">
		{@render footer()}
	</div>
{/if}

<style>
	.timeline { display: flex; gap: 0; align-items: stretch; }
	.timeline-item { flex: 1; padding: 16px 20px; border-left: 3px solid var(--cr-rule); }
	.timeline-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
	.timeline-version { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 2px; }
	.timeline-status { font-size: 0.7rem; }
	.timeline-title { font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; color: var(--cr-text); margin-bottom: 4px; }
	.timeline-desc { font-size: 0.7rem; color: var(--cr-text-mid); line-height: 1.5; }
	.timeline-footer { margin-top: 16px; background: var(--cr-surface); border: 1px solid var(--cr-rule); border-radius: 4px; padding: 10px 14px; }
</style>
