<script context="module" lang="ts">
	import { slide } from 'svelte/transition';
    import { writable } from "svelte/store";

    export const show_update_prompt = writable<() => void>();
</script>

<script>

</script>

{#if $show_update_prompt}
<article transition:slide class="ViteUpdatePrompt">
    App has been updated. Please reopen the app or 
    <a href={'#'} on:click|preventDefault={$show_update_prompt} >
        reload
    </a>
</article>
{/if}

<style lang="scss">
    article {
        margin-block: 0px;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        
        background-color: black;
        color: white;
    } 

</style>