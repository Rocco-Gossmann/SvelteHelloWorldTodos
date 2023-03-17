<script context="module" lang="ts">

</script>

<script lang="ts">
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';
    import { tagstore } from '../data/Tags';

    const on = createEventDispatcher();

    export let visible = true;
    export let value = "";

    $tagstore
</script>
{#if visible}
<form class="taginput" class:open={visible} 
    transition:slide 
    on:submit|preventDefault={() => on("submit", value)}
>
    <input type="text" bind:value={value} list="taginput_datalist" autocomplete=""/>
    <button type="submit" class="fa fa-plus-circle"></button>

    <datalist id="taginput_datalist">
        {#each $tagstore as tag}
            <option value={tag.value} /> 
        {/each}
    </datalist> 
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
