import { describe, it, expect, beforeEach } from 'vitest';
import { createNavigation } from '../src/lib/navigation.svelte.ts';

describe('navigation', () => {
	let nav: ReturnType<typeof createNavigation>;

	beforeEach(() => {
		nav = createNavigation(15);
	});

	it('starts at slide 0', () => {
		expect(nav.current).toBe(0);
	});

	it('advances to next slide', () => {
		nav.next();
		expect(nav.current).toBe(1);
	});

	it('goes to previous slide', () => {
		nav.next();
		nav.next();
		nav.prev();
		expect(nav.current).toBe(1);
	});

	it('does not go below 0', () => {
		nav.prev();
		expect(nav.current).toBe(0);
	});

	it('does not exceed total - 1', () => {
		for (let i = 0; i < 20; i++) nav.next();
		expect(nav.current).toBe(14);
	});

	it('goTo jumps to specific slide', () => {
		nav.goTo(7);
		expect(nav.current).toBe(7);
	});

	it('goTo clamps out-of-range values', () => {
		nav.goTo(99);
		expect(nav.current).toBe(14);
		nav.goTo(-5);
		expect(nav.current).toBe(0);
	});

	it('reports progress as fraction', () => {
		expect(nav.progress).toBe(0);
		nav.goTo(7);
		expect(nav.progress).toBeCloseTo(7 / 14);
		nav.goTo(14);
		expect(nav.progress).toBe(1);
	});
});
