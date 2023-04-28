<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { TagManager, TagInstanceStore, TagInstance } from "../data/TagManager";

    import DebugModule from "../lib/debug";

    const debug = DebugModule.prefix("Tag.svelte");

    export let tagstore: TagInstanceStore = undefined;
    export let value = "";
    export let key = "";

    export let noremove = false;
    export let noclick = false;

    const on = createEventDispatcher()

    $: if(!tagstore) {
        if(key) {
            TagManager.getInstanceByPK(key).then( store => {
                debug.prefix("#tagstoreupdate", "got store for key", key, store.object.value)
                tagstore = store
            });
        }
        else if(value) { 
            TagInstance.generatePrimaryKey(value)
                .then( key => TagManager.getInstanceByPK(key))
                .then( store => {
                    debug.prefix("#tagstoreupdate", "got new store for value", value, store.object.value)
                    tagstore = store
                });
        }
    }

</script>

{#if tagstore}
 <span class="tag" style={`--tagcolor: ${$tagstore.color}`}>
    {#if noclick}
        {$tagstore.value}
    {:else}
        <a href={'#'} on:click|preventDefault={() => on("click", tagstore)}>{$tagstore.value}</a>
    {/if}
    {#if !noremove}
    <a href={'#'} class="fa fa-times" 
        on:click|preventDefault={() => on("remove", tagstore)}>&nbsp;</a>
    {/if}
 </span>
 {/if}

 <style lang="scss">
    .tag  {
        --tagcolor: white;

        display: inline-block;
        white-space: nowrap;
        border-radius: var(--border-radius);
        padding: var(--nav-link-spacing-vertical) var(--nav-link-spacing-horizontal);
        box-shadow: 0px 0px 4px 2px var(--tagcolor);
        border: 2px solid var(--tagcolor);

        & > A{
            color: black;
        }

    }
 </style>
