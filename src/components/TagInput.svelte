<script lang="ts">
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';

    const on = createEventDispatcher();

    export let visible = true;
    export let value = "";
</script>
{#if visible}
<form class="taginput" class:open={visible} 
    transition:slide 
    on:submit|preventDefault={() => on("submit", value)}
>
    <input type="text" bind:value={value} />
    <button type="submit" class="fa fa-plus-circle"></button>
</form>
{/if}

<style>
    FORM.taginput {
        display: grid;
        grid-template-columns: 1fr 0fr;
        grid-gap: var(--spacing);
    }

    FORM.taginput BUTTON {
        width: auto;
    }

</style>
