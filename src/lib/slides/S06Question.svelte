<script>
	import Slide from '$lib/Slide.svelte';
	import Screenshot from '$lib/Screenshot.svelte';
</script>

<Slide number={6} total={16}>
	<p class="section-label">Guardrails</p>
	<h1 class="slide-title">Agents keep humans in the loop</h1>

	<div class="split-2" style="margin-top: 24px;">
		<Screenshot src="/screenshots/agent-question.png" alt="Agent question UI with multiple-choice options" />
		<div class="explanation">
			<p class="body-text">
				When the agent is uncertain, it <strong>pauses execution</strong> and asks the operator.
			</p>
			<p class="body-text" style="margin-top: 12px;">
				The question surfaces in the dashboard via SSE. Operator answers, agent resumes.
			</p>
			<p class="dim" style="margin-top: 12px;">
				Timeout fallback: agent proceeds autonomously after 5 minutes.
			</p>
		</div>
	</div>
</Slide>

<style>
	.explanation {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	strong {
		color: var(--cr-text);
	}

	.dim {
		font-size: 0.9rem;
		color: var(--cr-text-dim);
	}
</style>
