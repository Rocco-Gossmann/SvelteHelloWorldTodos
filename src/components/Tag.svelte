<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Tags, { ITag } from "../data/Tags";

    export let value = "";
    export let key = "";

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
    <a href={'#'} on:click|preventDefault={() => on("click", oTag)}>{oTag.value}</a>
    <a href={'#'} class="fa fa-times" 
        on:click|preventDefault={() => on("remove", oTag)}>&nbsp;</a>
 </span>
 {/if}