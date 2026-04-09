<script lang="ts">
	import Slide from '$lib/Slide.svelte';

	const codeHtml = `<span class="comment">// harness.config.json</span>
{
  <span class="key">"agents"</span>: {
    <span class="key">"default"</span>: {
      model: <span class="str">"sonnet"</span>,
      budget: <span class="num">5.0</span>
    },
    <span class="key">"heavy"</span>: {
      model: <span class="str">"opus"</span>,
      budget: <span class="num">20.0</span>,
      <span class="key">evaluator</span>: { ... },
      <span class="key">qualityChecks</span>: [
        <span class="str">"npm test"</span>
      ]
    }
  }
}`;
</script>

<Slide number={12} total={16}>
	<p class="section-label">Customization</p>
	<h1 class="slide-title">Specialized agents for specialized work</h1>

	<div class="split-2" style="margin-top: 24px;">
		<pre class="code-block">{@html codeHtml}</pre>

		<div class="points">
			<div class="point">
				<strong>Automated review via profiles</strong>
				<p>The <code>evaluator</code> field triggers gen/eval pipelines — no human review needed for standard tasks.</p>
			</div>
			<div class="point">
				<strong>Per-repo context</strong>
				<p>Agents load the target repo's CLAUDE.md, skills, and settings. Each codebase teaches agents its conventions autonomously.</p>
			</div>
			<div class="point">
				<strong>Mechanical quality enforcement</strong>
				<p><code>qualityChecks</code> run tests and linters before the agent can finish. Failures force the agent to keep working.</p>
			</div>
			<div class="point">
				<strong>Subagents</strong>
				<p>Profiles declare sub-agents with their own tools, prompts, and model overrides for decomposed parallel work.</p>
			</div>
		</div>
	</div>
</Slide>

<style>
	.points {
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: center;
	}

	.point strong {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--cr-text);
		display: block;
		margin-bottom: 2px;
	}

	.point p {
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}

	code {
		font-family: var(--font-mono);
		color: var(--cr-amber);
		font-size: 0.85rem;
	}

	.code-block {
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		padding: 20px 24px;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--cr-text-mid);
		overflow-x: hidden;
		white-space: pre;
		margin: 0;
	}

	.code-block :global(.key)     { color: var(--cr-amber); }
	.code-block :global(.str)     { color: var(--cr-moss); }
	.code-block :global(.num)     { color: var(--cr-copper); }
	.code-block :global(.comment) { color: var(--cr-text-dim); }
</style>
