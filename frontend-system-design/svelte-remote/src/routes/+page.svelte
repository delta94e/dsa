<script lang="ts">
    import Widget from "$lib/components/Widget.svelte";
    import Counter from "$lib/components/Counter.svelte";
</script>

<main>
    <h1>🚀 Svelte Remote Application</h1>
    <p>This app exposes components via Module Federation</p>

    <section>
        <h2>Widget Component</h2>
        <Widget
            title="Demo Widget"
            description="Testing the federated component"
        />
    </section>

    <section>
        <h2>Counter Component</h2>
        <Counter initialValue={0} step={1} />
    </section>
</main>

<style>
    main {
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #ff3e00;
    }

    section {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 8px;
    }
</style>
