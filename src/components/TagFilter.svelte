<script context="module">
    import { writable } from 'svelte/store';
    import { edittag } from './TagEdit.svelte';
	//import type { TagInstance, TagInstanceStore } from '../data/TagManager'
    import DebugModule from '../lib/debug'

    const debug = DebugModule.prefix("TagFilter.svelte")

    /** @type {Writable<string[]>} */
    export const tagfilter = writable([]);


    /** exportaddTag() Adds a tag to the filter
     * @param {TagInstanceStore}  tag  -
     */
    export function addTag(tag) {
        debug.prefix("#addTag()", tag);

        tag.getKey()
            .then( key => tagfilter.update( lst => {

                if(lst.indexOf(key) == -1) {
                    lst.push(key);
                }

                return lst;
            }))
    }

    /**  @type {string | Array.<string>} */
    let filter = localStorage.getItem("tagfilter");
    let lastlist = [];
    try { filter = JSON.parse(filter); }
    catch( err ) {
        debug.error(err); 
        filter = [];
    }

/*
    try {
        let filter = localStorage.getItem("tagfilter");

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
    catch( err ) { debug.error("on load error", err)  }
*/
    tagfilter.subscribe ( (lst) => {
        localStorage.setItem("tagfilter", JSON.stringify(lst));
        Todos.filter(lst);
    })

</script>

<script lang="ts">
    import { slide } from 'svelte/transition'
    import Tag from './Tag.svelte';
    import Todos from '../data/Todos';
    import TagInput from './TagInput.svelte';
    import TagEdit from './TagEdit.svelte';

    import { key, hasPassword } from '../data/Lock';
    import type { TagInstanceStore } from '../data/TagManager';

    const debug = DebugModule.prefix("TagFilter.svelte");

    $: visible = ($hasPassword && !$key) ? false : $tagfilter.length > 0;
    $: debug.log("visible changed", visible);

    let tagInput = "";

    const onAddTag = async (ev: CustomEvent) => {
        let oTag: TagInstance  = ev.detail.object;
        addTag(oTag);
        tagInput = "";
    }

    const removeTag = async (oTag: TagInstanceStore) => {
        const _debug = debug.prefix("#removeTag()", oTag, $tagfilter);
        if($edittag == oTag) $edittag = undefined;

        const tagkey = await oTag.object.getKey()
        _debug.log("got key", tagkey)

        $tagfilter = $tagfilter.filter( (t) => t != tagkey );
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
