<script lang="ts">
    import { slide } from 'svelte/transition'
    import Tag from './Tag.svelte';
    import { edittag } from './TagEdit.svelte';
    import TagInput from './TagInput.svelte';
    import TagEdit from './TagEdit.svelte';
    import { key, hasPassword } from '../data/Lock';
    import { tagfilter } from '../data/TagFilter';

    $: visible = ($hasPassword && !$key) ? false : $tagfilter.length > 0;

    let tagInput = "";

    function removeTag(ev) {
        const key = ev?.detail?.data?.key;
        const index = $tagfilter.indexOf(key);
        if(index > -1) {
            $tagfilter.splice(index, 1);
            $tagfilter = $tagfilter;
        }
    }

    function onAddTag(ev) {
        const key = ev?.detail?.data?.key;

        if(key && $tagfilter.indexOf(key) == -1) {
            $tagfilter.push(key);
            $tagfilter = $tagfilter;
        }
        else console.error("missing key", ev, key)
    }

</script>


<a role="button" href={"#"} on:click|preventDefault={() => visible = !visible }>Tags</a>

{#if visible}
<TagInput bind:value={tagInput} on:submit={onAddTag} />

<TagEdit />

<section class="taglist" class:open={visible} transition:slide>

    {#if $tagfilter.length}

        {#each $tagfilter as tag}
            <Tag 
                key={tag} 
                on:remove={ removeTag } 
                on:click={ (ev) => {
                    console.log(ev.detail, $edittag, edittag)
                    edittag.set(edittag && $edittag==ev.detail ? undefined : ev.detail) 
                }}
            />
        {/each}

    {:else}
        No Tags yet
    {/if}

</section>
{/if}


<style>
    A[role=button] {
        white-space: nowrap;
        width: auto;
        float: left;
        margin-right: var(--spacing);
    }

    SECTION.taglist {
        display: block;
    }

    SECTION.taglist :global(SPAN.tag) {
        margin: var(--spacing);
    }

    SECTION.taglist :global(SPAN.tag > A) {
        margin-left: var(--spacing);
    }

</style>
