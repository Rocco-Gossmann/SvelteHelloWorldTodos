<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition'
    export const contentClass="";
    export const backdropClass="";

    export let open = true;

    let me: HTMLElement;

    onMount(  () => { 
        document.body.appendChild(me); 
        document.body.style.overflow = "hidden"
        open = true; 
    })

    onDestroy(() => { 
        document.body.removeChild(me); 
        document.body.style.overflow = ""
        open = false;
    })


</script>

<div class="modalContainer" in:fade out:fade bind:this={me}>
    <div class="modalBackdrop {backdropClass}"> </div>
    <div class="modalContent Modal {contentClass}"> 
        <slot />
    </div>
</div>

<style lang="scss">

    .modalContainer {
        position: fixed;
        inset: 0;

        display: flex;
        justify-content: center;
        place-items: center;

        z-index: 99997;

        .modalBackdrop {
            display:block;
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, .666);
            z-index: 1;
        }

        .modalContent {
            z-index: 2;
        }
    }
</style>
