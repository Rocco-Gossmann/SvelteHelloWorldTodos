<script context="module" lang="ts">
    import { isArray } from '../lib/utils';
    import { writable } from 'svelte/store';
    import { edittag } from './TagEdit.svelte';

    export const tagfilter = writable<string[]>([]);

    export function addTag(tag: ITag) {
        tagfilter.update( lst => {
            if(lst.indexOf(tag.key) == -1) {
                lst.push(tag.key);
            }
            return lst;
        });
    }


    try {
        let filter = localStorage.getItem("tagfilter");
        let lastlist = [];
        if(filter) filter = JSON.parse(filter);
        if(isArray(filter)) {
            tagfilter.set(filter);
            const clearTags = [];
            (async () => {
                let tags = await Promise.all(
                    filter.map( 
                        (tag) => Tags.findByValue(tag)
                            .catch( err => {
                                console.warn(`tag '${tag}' does not exist`)
                                clearTags.push(tag);
                            })
                    )
                );

                clearTags.forEach((t) => tagfilter.update( list => lastlist = list.filter( t1 => t1 != t)))

                if(isArray(tags))
                    tags = tags.filter(t=>typeof(t) !== 'undefined');

            })()
        }

    }
    catch( err ) { /* NOP */ }

    tagfilter.subscribe ( (lst) => {
        localStorage.setItem("tagfilter", JSON.stringify(lst));
        Todos.filter(lst);
    })

</script>

<script lang="ts">
    import { slide } from 'svelte/transition'
    import Tag from './Tag.svelte';
    import Tags, { ITag, type TagStore } from '../data/Tags'
    import Todos from '../data/Todos';
    import TagInput from './TagInput.svelte';
    import TagEdit from './TagEdit.svelte';
    import { key, hasPassword } from './Lock.svelte';

    $: visible = ($hasPassword && !$key) ? false : $tagfilter.length > 0;

    let tagInput = "";

    const onAddTag = async (ev: CustomEvent) => {
        let oTag: ITag  = ev.detail.object;
        addTag(oTag);
        tagInput = "";
    }

    const removeTag = async (oTag: TagStore) => {
        if($edittag == oTag) $edittag = undefined;
        $tagfilter = $tagfilter.filter( (t) => t != oTag.object.key );
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
                on:remove={ (ev) => removeTag(ev.detail) } 
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