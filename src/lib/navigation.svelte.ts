export function createNavigation(total: number) {
	let current = $state(0);

	function clamp(n: number): number {
		return Math.max(0, Math.min(total - 1, n));
	}

	return {
		get current() {
			return current;
		},
		get total() {
			return total;
		},
		get progress() {
			return total <= 1 ? 0 : current / (total - 1);
		},
		next() {
			current = clamp(current + 1);
		},
		prev() {
			current = clamp(current - 1);
		},
		goTo(n: number) {
			current = clamp(n);
		},
	};
}
