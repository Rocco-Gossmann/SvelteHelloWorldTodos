<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Tags, { ITag } from "../data/Tags";

    export let value = "";
    export let key = "";

    export let noremove = false;
    export let noclick = false;

    let oTag: ITag|void;

    $: if(key) {
        try {
            Tags.findByKey(key).then( t => oTag = t );
        } catch( err ) { console.error( err ); oTag = undefined; }
    }
    else if( value ) {
        try {
            Tags.findByValue(value).then( t => oTag = t );
        } catch( err ) { console.error( err ); oTag = undefined; }
    }

    const on = createEventDispatcher()

</script>

{#if oTag}
 <span class="tag">
    {#if noclick}
        {oTag.value}
    {:else}
        <a href={'#'} on:click|preventDefault={() => on("click", oTag)}>{oTag.value}</a>
    {/if}
    {#if !noremove}
    <a href={'#'} class="fa fa-times" 
        on:click|preventDefault={() => on("remove", oTag)}>&nbsp;</a>
    {/if}
 </span>
 {/if}