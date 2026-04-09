<script lang="ts">
	import { onMount } from 'svelte';
	import { createNavigation } from '$lib/navigation.svelte.ts';
	import ProgressBar from '$lib/ProgressBar.svelte';

	import S01Title from '$lib/slides/S01Title.svelte';
	import S02Problem from '$lib/slides/S02Problem.svelte';
	import S03Hook from '$lib/slides/S03Hook.svelte';
	import S04Intake from '$lib/slides/S04Intake.svelte';
	import S05Dispatch from '$lib/slides/S05Dispatch.svelte';
	import S06Question from '$lib/slides/S06Question.svelte';
	import S07Pipeline from '$lib/slides/S07Pipeline.svelte';
	import S08Review from '$lib/slides/S08Review.svelte';
	import S09Architecture from '$lib/slides/S09Architecture.svelte';
	import S10StateMachine from '$lib/slides/S10StateMachine.svelte';
	import S11Guardrails from '$lib/slides/S11Guardrails.svelte';
	import S12Profiles from '$lib/slides/S12Profiles.svelte';
	import S13Roadmap from '$lib/slides/S13Roadmap.svelte';
	import S14TheAsk from '$lib/slides/S14TheAsk.svelte';
	import S15GameReveal from '$lib/slides/S15GameReveal.svelte';
	import S16Punchline from '$lib/slides/S16Punchline.svelte';

	const nav = createNavigation(16);

	const slides = [
		S01Title, S02Problem, S03Hook,
		S04Intake, S05Dispatch, S06Question, S07Pipeline, S08Review,
		S09Architecture, S10StateMachine, S11Guardrails, S12Profiles,
		S13Roadmap, S14TheAsk, S15GameReveal, S16Punchline
	];

	function readHash() {
		const hash = window.location.hash;
		if (hash) {
			const n = parseInt(hash.slice(1));
			if (!isNaN(n) && n >= 1) nav.goTo(n - 1);
		}
	}

	onMount(readHash);

	$effect(() => {
		if (typeof window !== 'undefined') {
			window.location.hash = `#${nav.current + 1}`;
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			nav.next();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			nav.prev();
		} else if (e.key === 'f') {
			document.documentElement.requestFullscreen?.();
		}
	}
</script>

<svelte:head>
	<title>Harness — Presentation</title>
	<style>
		html, body { overflow: hidden; }
	</style>
</svelte:head>

<svelte:window onkeydown={handleKeydown} onhashchange={readHash} />

{#key nav.current}
	{@const CurrentSlide = slides[nav.current]}
	<div class="slide-wrapper">
		<CurrentSlide />
	</div>
{/key}

<ProgressBar progress={nav.progress} />

<style>
	.slide-wrapper {
		animation: fade-in 0.3s ease;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
