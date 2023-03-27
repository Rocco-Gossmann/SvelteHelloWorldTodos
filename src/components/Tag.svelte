<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Tags, {type TagStore, ITag } from "../data/Tags";

    export let tagstore: TagStore|undefined = undefined;
    export let tag: ITag|undefined = undefined;
    export let value = "";
    export let key = "";

    export let noremove = false;
    export let noclick = false;

    let oTag: TagStore;
    const on = createEventDispatcher()

    $: if(tagstore) oTag = tagstore
    
    else if(tag)  oTag = Tags.getTagStore(tag); 

    else if(key) {
        try {
            Tags.findByKey(key).then( t => oTag = t );
        } catch( err ) { console.error( err ); oTag = undefined; }
    }

    else if( value ) {
        try {
            Tags.findByValue(value).then( t => oTag = t );
        } catch( err ) { console.error( err ); oTag = undefined; }
    }

</script>

{#if oTag}
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