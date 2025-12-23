<script lang="ts">
	// Widget component for Svelte 5
	let {
		title = "Hello from Svelte!",
		description = "This component is loaded via Module Federation",
	} = $props();

	let isHovered = $state(false);
</script>

<div
	class="widget"
	class:hovered={isHovered}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<div class="icon">🚀</div>
	<h3>{title}</h3>
	<p>{description}</p>
	<span class="badge">Svelte 5 Remote</span>
</div>

<style>
	.widget {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 16px;
		padding: 24px;
		color: white;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		cursor: pointer;
	}

	.widget.hovered {
		transform: translateY(-4px);
		box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
	}

	.icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	h3 {
		margin: 0 0 8px 0;
		font-size: 24px;
		font-weight: 600;
	}

	p {
		margin: 0 0 16px 0;
		opacity: 0.9;
		font-size: 14px;
	}

	.badge {
		display: inline-block;
		background: rgba(255, 255, 255, 0.2);
		padding: 4px 12px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 500;
	}
</style>
