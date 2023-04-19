<script lang="ts">
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';
    import { toast } from '../lib/components/Toast.svelte';

    import {TagManager, TagInstance, TagError} from '../data/TagManager';

    import { key } from '../data/Lock'
    import { isError } from '../lib/utils';

    const on = createEventDispatcher();

    export let visible = true;
    export let value = "";
    export let noautocreate = false;

    const onSubmit = () => {
        TagInstance.generatePrimaryKey(value)
            .then( key => TagManager.createNewEntry({ value, key }, $key) )
            .then( tag => on("submit", tag) )

            .catch( err  => {
                if(isError(err) && err.message == TagError.EMPTY_TAG_KEY)
                    toast("can't submit an empty Tag", "alert", 2);
                else {
                    console.error( err )
                    toast("ERROR: see console", "alert", 2);
                }
            })
    }
</script>
{#if visible}
<form class="taginput" class:open={visible} 
    transition:slide
    on:submit|preventDefault={onSubmit}
>
    <input type="text" bind:value={value} list="available_tags" autocomplete=""/>
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
