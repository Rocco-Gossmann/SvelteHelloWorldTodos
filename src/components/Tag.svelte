<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let value = "";

    const on = createEventDispatcher()

</script>

 <span>
    {value}
    <a href={'#'} class="fa fa-times" on:click|preventDefault={() => on("remove")}>&nbsp;</a>
 </span>


 <style>
    SPAN {
        display: inline-block;
        margin: var(--spacing);
        background-color: var(--muted-color);
        padding: var(--nav-link-spacing-vertical) var(--nav-link-spacing-horizontal);
        border-radius: var(--border-radius);
        color: white;
    }

    SPAN > A {
        color: white;
        margin-left: var(--spacing);
    }


 </style>