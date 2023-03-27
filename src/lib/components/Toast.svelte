<script lang="ts" context="module">
    import { writable, type Writable } from 'svelte/store';
    let id = 1;
    interface IToast {
        id: number
        msg: string
        cssClass: string
        timeout: number
    }

    const toasts: Writable<IToast[]> = writable([]);

    export function toast(msg, cssClass, timeout=4) {
        toasts.update( (t) => { t.push({ id: id++, msg, cssClass, timeout: timeout*10 }); return t } )
    }

</script>



<script lang="ts">
    import {slide} from 'svelte/transition'

    let currentTo: number;

    function syncToasts() {
        if(!currentTo && $toasts.length) {
            currentTo = window.setTimeout( () => {
                $toasts.forEach( t => t.timeout-- ); 
                $toasts = $toasts.filter( t => t.timeout > 0)
                currentTo = undefined;
                syncToasts();
            }, 100);
        }
    }

    $: if($toasts.length) syncToasts();

</script>




<div class="toastcontainer">
{#each $toasts as toast (toast.id)}
    <article class={toast.cssClass} transition:slide={{duration: 250}}> {toast.msg} </article>
{/each}
</div>



<style>
    .toastcontainer {
        display: inline-block;
        position: fixed;
        display: block;
        text-align: center;
        left: 50%;
        top: 0px;
        transform: translateX(-50%);
        z-index: 99998;
    }

    .toastcontainer > ARTICLE {
        padding: calc(var(--block-spacing-vertical) / 2) var(--block-spacing-horizontal)
    }

    .toastcontainer .error,
    .toastcontainer .alert {
        background-color: red;
        color: white;
    }

    .toastcontainer .success {
        background-color: lightgreen;
        color: black
    }

    .toastcontainer .info {
        background-color: darkslategray;
        color: white
    }

    @media(max-width: 768px) {
        .toastcontainer > * {
            left: 0px;
            width: 100vw;
        }
    }
</style>
