<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
</script>

<Slide number={2} total={16}>
	<h1 class="slide-title">As AI agents scale,<br />the human becomes the bottleneck.</h1>

	<div class="split-4" style="margin-top: 32px; margin-bottom: 24px;">
		<Card>
			<p class="card-label">Multi-Agent Coordination</p>
			<p>Who orchestrates when multiple agents work simultaneously? Who resolves conflicts?</p>
		</Card>
		<Card>
			<p class="card-label">Context Beyond One Agent</p>
			<p>Codebases and background knowledge exceed any single agent's context window.</p>
		</Card>
		<Card>
			<p class="card-label">The Human Bottleneck</p>
			<p>Approval, feedback, direction, test coordination — humans can't keep up at scale.</p>
		</Card>
		<Card>
			<p class="card-label">Multi-Repo Complexity</p>
			<p>Enterprise work spans repositories, environments, and toolchains.</p>
		</Card>
	</div>

	<p class="footer">Harness automates orchestration so humans only intervene at critical decision points.</p>
</Slide>

<style>
	.footer {
		font-size: 0.9rem;
		color: var(--cr-text-dim);
		font-style: italic;
	}
</style>
