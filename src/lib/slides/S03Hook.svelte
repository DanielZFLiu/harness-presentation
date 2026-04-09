<script>
	import Slide from '$lib/Slide.svelte';
</script>

<Slide number={3} total={16}>
	<h1 class="slide-title">"Let's build a video game<br />from scratch."</h1>
	<p class="slide-subtitle">Harness takes a game spec and produces a working game. No human writes code.</p>

	<div class="flow-pipeline">
		<div class="flow-step">
			<div class="flow-node flow-node--input">Spec</div>
			<div class="flow-label">raw requirements</div>
		</div>
		<div class="flow-arrow">&rarr;</div>
		<div class="flow-step">
			<div class="flow-node flow-node--harness">Intake</div>
			<div class="flow-label">LLM decomposition</div>
		</div>
		<div class="flow-arrow">&rarr;</div>
		<div class="flow-step">
			<div class="flow-node flow-node--harness">Dispatch</div>
			<div class="flow-label">workspace + agent</div>
		</div>
		<div class="flow-arrow">&rarr;</div>
		<div class="flow-step">
			<div class="flow-node flow-node--agent">Agent</div>
			<div class="flow-label">writes code + tests</div>
		</div>
		<div class="flow-arrow">&rarr;</div>
		<div class="flow-step">
			<div class="flow-node flow-node--review">Automated Review</div>
			<div class="flow-label">gen/eval pipeline</div>
		</div>
		<div class="flow-arrow">&rarr;</div>
		<div class="flow-step">
			<div class="flow-node flow-node--output">Working Game</div>
			<div class="flow-label">branch merged</div>
		</div>
	</div>

	<p class="flow-note">Human review available when needed — but not required.</p>
</Slide>

<style>
	.flow-pipeline {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 6px;
		margin: 40px 0 20px;
	}

	.flow-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.flow-node {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		padding: 10px 18px;
		border-radius: 4px;
		white-space: nowrap;
	}

	.flow-node--input   { background: var(--cr-surface-hot); color: var(--cr-text-dim); }
	.flow-node--harness { background: var(--cr-surface-alt); color: var(--cr-amber); border: 1px solid var(--cr-amber-dim); }
	.flow-node--agent   { background: var(--cr-surface-alt); color: var(--cr-copper); border: 1px solid var(--cr-copper); }
	.flow-node--review  { background: var(--cr-surface-alt); color: var(--cr-moss); border: 1px solid var(--cr-moss); }
	.flow-node--output  { background: var(--cr-moss); color: var(--cr-bg); }

	.flow-label {
		font-family: var(--font-body);
		font-size: 0.7rem;
		color: var(--cr-text-dim);
	}

	.flow-arrow {
		color: var(--cr-amber-dim);
		font-size: 1.2rem;
		padding-top: 10px;
	}

	.flow-note {
		font-size: 0.85rem;
		color: var(--cr-text-dim);
		text-align: center;
	}
</style>
