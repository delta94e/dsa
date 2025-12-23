<script lang="ts">
	// Counter component with Svelte 5 reactive state
	let { initialValue = 0, step = 1 } = $props();

	let count = $state(initialValue);

	function increment() {
		count += step;
	}

	function decrement() {
		count -= step;
	}

	function reset() {
		count = initialValue;
	}
</script>

<div class="counter">
	<h4>Svelte 5 Counter</h4>
	<div class="display">{count}</div>
	<div class="buttons">
		<button onclick={decrement}>−</button>
		<button onclick={reset}>Reset</button>
		<button onclick={increment}>+</button>
	</div>
</div>

<style>
	.counter {
		background: #1a1a2e;
		border-radius: 12px;
		padding: 24px;
		text-align: center;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		color: white;
		width: fit-content;
	}

	h4 {
		margin: 0 0 16px 0;
		color: #f97316;
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.display {
		font-size: 48px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		margin-bottom: 16px;
		background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.buttons {
		display: flex;
		gap: 8px;
	}

	button {
		flex: 1;
		padding: 12px 24px;
		border: none;
		border-radius: 8px;
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:first-child {
		background: #ef4444;
		color: white;
	}

	button:nth-child(2) {
		background: #374151;
		color: white;
	}

	button:last-child {
		background: #22c55e;
		color: white;
	}

	button:hover {
		transform: scale(1.05);
	}
</style>
