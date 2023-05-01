<script lang="ts">
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';
    import { toast } from '../lib/components/Toast.svelte';

    import {TagManager, TagInstance, TagError} from '../data/TagManager';
    import DebugModule from '../lib/debug';

    import { key } from '../data/Lock'

    const on = createEventDispatcher();
    const debug = DebugModule.prefix("TagInput.svelte");

    export let visible = true;
    export let value = "";
    export let noautocreate = false;

    const onSubmit = async () => {
        const deb = debug.prefix("#onSubmit()", value);
        
        const pk = await TagInstance.generatePrimaryKey(value);
        deb.log("pk is ", pk)

        let tag;

        try { tag = await TagManager.getInstanceByPK(pk); }
        catch( err ) {
            deb.log("cought something", err, err?.message, err?.message == TagError.NO_TAG_FOR_KEY);
            switch(err?.message) {
                case TagError.EMPTY_TAG_KEY: 
                    deb.log("empty tag");
                    toast("can't submit an empty Tag", "alert", 2); 
                    return;

                case TagError.NO_TAG_FOR_KEY: 
                    deb.log("no tag for key yet => create one");
                    tag = await TagManager.createNewEntry({ value, key: pk});
                    break;

                default:
                    deb.error( err )
                    toast("ERROR: see console", "alert", 2);
            }
        }
        finally {
            deb.log("tag is", tag);
            if(tag) on("submit", tag);
        }
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
