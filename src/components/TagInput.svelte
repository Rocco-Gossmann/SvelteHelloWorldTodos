<script lang="ts">
    import { slide } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';
    import { toast } from '../lib/components/Toast.svelte';
    import TagManager from '../data/TagManager';

    const on = createEventDispatcher();

    export let visible = true;
    export let value = "";
    export let noautocreate = false;

    const onSubmit = async () => {
        let key: string;
        try { key = await TagManager.definePKByValue(value);
        } catch( err ) { toast("can't submit an empty Tag", "alert", 2); return; }

        let tag = await TagManager.findByPK(key);

        if(!tag) {
            if(noautocreate) {
                toast("tag is unknown", "alert", 2); 
                return
            } 

            const tagdata = {key, value, color: "#73828c"};
            tag = await TagManager.update(tagdata);
        }

        on("submit", tag);
        value = "";
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
