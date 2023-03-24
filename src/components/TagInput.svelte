<script lang="ts">
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';
    import Tags, { ITag, TagsError, type TagStore } from '../data/Tags';
    import { toast } from '../lib/components/Toast.svelte';

    const on = createEventDispatcher();

    export let visible = true;
    export let value = "";
    export let noautocreate = false;
    let oTag: TagStore;

    const onSubmit = async () => {

        try { oTag = await Tags.findByValue(value); } 
        catch ( err ) { 
            if(err instanceof TagsError && err.message == TagsError.NO_TAG_FOR_KEY) {
                try { 
                    if(noautocreate) {
                        toast("tag is unknown", "alert", 2); 
                        return
                    } 
                    else {
                        const tag = new ITag({value}); 
                        await tag.insert();
                        oTag = Tags.getTagStore(tag);
                    }
                }
                catch( err ) {
                    if(err instanceof TagsError && err.message == TagsError.EMPTY_TAG_KEY) 
                        toast("can't submit an empty Tag", "alert", 2);
                    else {
                        console.error( err )
                        toast("ERROR: see console", "alert", 2);
                    }
                    return
                }
            } 
            else {
                console.error( err )
                toast("ERROR: see console", "alert", 2);
                return
            }
        }
        
        on("submit", oTag);
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
