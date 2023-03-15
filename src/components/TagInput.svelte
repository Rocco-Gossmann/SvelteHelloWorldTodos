<script context="module" lang="ts">
	import Vault from './../assets/vendor/fontawesome/svgs/solid/vault.svg';
    import { isArray } from '../lib/utils';
    import { writable } from 'svelte/store';

    export const tagfilter = writable<string[]>([]);
    export const tagDisplay = writable<string[]>([]);

    try {
        let filter = localStorage.getItem("tagfilter");
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

                clearTags.forEach((t) => tagfilter.update( list => list.filter( t1 => t1 != t)))

                if(isArray(tags)) {
                    tags = tags.filter(t=>typeof(t) !== 'undefined');
                    tagDisplay.set(tags.map( (t: ITag) => {
                        if(t) return t.value
                    }))
                } 
            })()
        }

    }
    catch( err ) { /* NOP */ }


    tagfilter.subscribe ( (lst) => {
        localStorage.setItem("tagfilter", JSON.stringify(lst));
    })

</script>

<script lang="ts">
    import { slide } from 'svelte/transition'
    import Tag from './Tag.svelte';
    import Tags, { type ITag } from '../data/Tags'
    import Todos from '../data/Todos';
    import { toast } from '../lib/components/Toast.svelte';

    let visible = $tagfilter.length > 0;

    let tagInput = "";

    const addTag = async () => {

        let oTag: ITag|void;
        try {
            oTag = await Tags.findByValue(tagInput); 
        } catch( err ) {
            oTag = await Tags.insert(tagInput);
        }

        if(oTag) {
            $tagfilter.push(oTag.key);
            $tagDisplay.push(oTag.value);

            $tagfilter = $tagfilter;
            $tagDisplay = $tagDisplay;

            Todos.filter($tagfilter);
            tagInput = "";
        }
        else toast("could not add tag", "error", 3000);
    }

    const removeTag = async (tag) => {

        $tagDisplay = $tagfilter.filter( (t) => t != tag );

        const oTag: ITag = await Tags.findByValue(tag);
        if(oTag) {
            $tagfilter = $tagfilter.filter( (t) => t != oTag.key );
            $tagDisplay = $tagfilter.filter( (t) => t != oTag.value );
        }

        Todos.filter($tagfilter);
    }


</script>


<a role="button" href={"#"} on:click|preventDefault={() => visible = !visible }>Tags</a>

{#if visible}
<form class="taginput" class:open={visible} transition:slide|local on:submit|preventDefault={addTag}>
    <input type="text" bind:value={tagInput} />
    <button type="submit" class="fa fa-plus-circle"></button>
</form>

<section class="taglist" class:open={visible} transition:slide|local>

{#if $tagfilter.length}

    {#each $tagDisplay as tag}
        <Tag 
            value={tag} 
            on:remove={ () => removeTag(tag) } 
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

</style>