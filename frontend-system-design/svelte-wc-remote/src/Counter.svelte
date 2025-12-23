<svelte:options customElement="svelte-counter" />

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let initialValue: number = 0;
    export let step: number = 1;

    let count = initialValue;
    const dispatch = createEventDispatcher();

    function increment() {
        count += step;
        dispatch("countchanged", { count });
    }

    function decrement() {
        count -= step;
        dispatch("countchanged", { count });
    }

    function reset() {
        count = initialValue;
        dispatch("countchanged", { count });
    }
</script>

<div class="counter">
    <h4>Svelte Counter</h4>
    <div class="display">{count}</div>
    <div class="buttons">
        <button class="decrement" on:click={decrement}>−</button>
        <button class="reset" on:click={reset}>Reset</button>
        <button class="increment" on:click={increment}>+</button>
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
        color: #ff3e00;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .display {
        font-size: 48px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #ff3e00 0%, #ff6b35 100%);
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

    .decrement {
        background: #ef4444;
        color: white;
    }

    .reset {
        background: #374151;
        color: white;
    }

    .increment {
        background: #22c55e;
        color: white;
    }

    button:hover {
        transform: scale(1.05);
    }
</style>
