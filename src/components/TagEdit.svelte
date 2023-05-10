<script context="module" lang="ts">
    import { tagfilter } from '../data/TagFilter';
    import { toast } from '../lib/components/Toast.svelte';
    import type { Tag } from '../data/TagManager';

    export let edittag: Writable<Tag> = writable();
</script>

<script lang="ts">
    import {slide} from 'svelte/transition'
    import { writable, type Writable } from 'svelte/store';
    import TagManager from '../data/TagManager';

    const dropTag =async () => {
        if($edittag && confirm("deleting the tag here, will remove it from all Todos too. This step can not be undone! Continue?")) {
            await TagManager.drop($edittag)
            tagfilter.update( lst => lst.filter( t => t != $edittag.data.key ))
            $edittag = undefined;
            toast("tag removed", "info", 2);
        }
    }

    const saveTag = async () => {
//        await $edittag.insert(); 
//        $edittag.notifiySubscribers()
//        $edittag = undefined;
//        toast("changes saved", "success", 2);
    }

</script>
{#if $edittag}
<section transition:slide>

    <label for="tagedit_key_input">Key:</label>
    <input  id="tagedit_key_input" type="text" value={$edittag.data.key} disabled/>
    <button on:click|preventDefault={() => dropTag()} 
        class="fa fa-trash-can" title="delete"></button>


    <label for="tagedit_value_input">Value:</label>
    <input  id="tagedit_value_input" type="text" value={$edittag.data.value} disabled />

    <label for="tagedit_value_input">Color:</label>
    <input  id="tagedit_value_input" type="color" bind:value={$edittag.data.color} />

    <button id="tagedit_close_btn" on:click|preventDefault={() => $edittag=undefined}>close</button>
    <button id="tagedit_save_btn" on:click|preventDefault={ saveTag }>save</button>
</section>
{/if}

<style lang="scss">
    section {
        display: grid;
        grid-gap: var(--spacing);
        grid-template-columns: 0fr 1fr 0fr;
        align-items: center;

        #tagedit_value_input {
            grid-column: 2 / -1;
        }

        #tagedit_save_btn {
            width: auto;
            grid-column: 2 / -1;
            justify-self: right;
        }
    }
</style>
