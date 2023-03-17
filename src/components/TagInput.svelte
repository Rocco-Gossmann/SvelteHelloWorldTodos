<script context="module" lang="ts">
    import { isArray } from '../lib/utils';
    import { writable } from 'svelte/store';

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
    import Tags, { ITag, TagsError } from '../data/Tags'
    import Todos from '../data/Todos';
    import { toast } from '../lib/components/Toast.svelte';

    $: visible = $tagfilter.length > 0;

    let tagInput = "";

    const onAddTag = async () => {

        let oTag: ITag;

        try {
            oTag = new ITag(tagInput);
            await oTag.insert();
            addTag(oTag);
            tagInput = "";
        } catch( err ) {
            if(err instanceof TagsError && err.message == TagsError.EMPTY_TAG_KEY) {
                toast("cant add empty tag", "alert", 3);             
            }
            else {
                console.error(err);
                toast("ERROR: see console", "alert", 2);             
            }
        }
    }

    const removeTag = async (oTag: ITag) => {
        $tagfilter = $tagfilter.filter( (t) => t != oTag.key );
    }

</script>


<a role="button" href={"#"} on:click|preventDefault={() => visible = !visible }>Tags</a>

{#if visible}
<form class="taginput" class:open={visible} transition:slide|local on:submit|preventDefault={onAddTag}>
    <input type="text" bind:value={tagInput} />
    <button type="submit" class="fa fa-plus-circle"></button>
</form>

<section class="taglist" class:open={visible} transition:slide|local>

{#if $tagfilter.length}

    {#each $tagfilter as tag}
        <Tag noclick
            key={tag} 
            on:remove={ (ev) => removeTag(ev.detail) } 
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
    
    FORM.taginput {
        display: grid;
        grid-template-columns: 1fr 0fr;
        grid-gap: var(--spacing);
    }

    FORM.taginput BUTTON {
        width: auto;
    }

    SECTION.taglist {
        display: block;
    }

    SECTION.taglist :global(SPAN.tag) {
        display: inline-block;
        margin: var(--spacing);
        background-color: var(--muted-color);
        padding: var(--nav-link-spacing-vertical) var(--nav-link-spacing-horizontal);
        border-radius: var(--border-radius);
        color: white;
    }

    SECTION.taglist :global(SPAN.tag > A) {
        color: white;
        margin-left: var(--spacing);
    }

</style>