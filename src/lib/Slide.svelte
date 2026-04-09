<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		centered?: boolean;
		noNumber?: boolean;
		number?: number;
		total?: number;
		children: Snippet;
	}

	let { centered = false, noNumber = false, number = 0, total = 0, children }: Props = $props();
</script>

<div class="slide" class:slide--centered={centered}>
	<div class="slide-content">
		{@render children()}
	</div>
	{#if !noNumber && number > 0}
		<div class="slide-number">
			{String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}
		</div>
	{/if}
</div>

<style>
	.slide {
		width: 100vw;
		height: 100vh;
		padding: 64px 80px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
		position: relative;
		background:
			radial-gradient(ellipse 80% 60% at 50% 40%, rgba(23, 19, 16, 0.6) 0%, transparent 100%),
			var(--cr-bg);
	}

	.slide--centered {
		align-items: center;
		text-align: center;
	}

	.slide-content {
		width: 100%;
		max-width: 100%;
		animation: slide-enter 0.4s ease-out both;
	}

	.slide-content > :global(:nth-child(1)) { animation-delay: 0ms; }
	.slide-content > :global(:nth-child(2)) { animation-delay: 80ms; }
	.slide-content > :global(:nth-child(3)) { animation-delay: 160ms; }
	.slide-content > :global(:nth-child(4)) { animation-delay: 240ms; }
	.slide-content > :global(:nth-child(5)) { animation-delay: 320ms; }
	.slide-content > :global(:nth-child(6)) { animation-delay: 400ms; }

	.slide-content > :global(*) {
		animation: child-enter 0.4s ease-out both;
	}

	@keyframes child-enter {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes slide-enter {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.slide-number {
		position: absolute;
		bottom: 24px;
		right: 40px;
		font-family: var(--font-body);
		font-weight: 300;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: var(--cr-text-dim);
	}
</style>
