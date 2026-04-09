<script lang="ts">
	interface FlowNode { label: string; color: string; }
	interface FlowEdge { label: string; }

	interface Props {
		nodes: FlowNode[];
		edges: FlowEdge[];
	}

	let { nodes, edges }: Props = $props();
</script>

<div class="flow">
	{#each nodes as node, i}
		<div class="flow-node" style="background: {node.color}; color: var(--cr-bg);">
			{node.label}
		</div>
		{#if i < edges.length}
			<div class="flow-edge">{edges[i].label}</div>
		{/if}
	{/each}
</div>

<style>
	.flow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
	.flow-node { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 600; padding: 8px 16px; border-radius: 4px; }
	.flow-edge { font-family: var(--font-body); font-size: 0.7rem; color: var(--cr-text-dim); }
</style>
