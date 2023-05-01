<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TagManager from "../data/TagManager";

    export let key = "";

    export let noremove = false;
    export let noclick = false;

    let oTag;
    const on = createEventDispatcher()
    
    $: TagManager.findByPK(key).then( tag => oTag = tag);


</script>

{#if $oTag}
 <span class="tag" style={`--tagcolor: ${$oTag.color}`}>
    {#if noclick}
        {$oTag.value}
    {:else}
        <a href={'#'} on:click|preventDefault={() => on("click", oTag)}>{$oTag.value}</a>
    {/if}
    {#if !noremove}
    <a href={'#'} class="fa fa-times" 
        on:click|preventDefault={() => on("remove", oTag)}>&nbsp;</a>
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
