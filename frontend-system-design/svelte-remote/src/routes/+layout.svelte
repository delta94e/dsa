<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Svelte Remote</title>
</svelte:head>

{@render children()}
