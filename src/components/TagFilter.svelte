<script context="module" lang="ts">
    import { edittag } from "./TagEdit.svelte";
    import DebugModule from "../lib/debug";
    import tagfilter from "../data/TagFilter";
    import { key } from "../data/Lock";

    const debug = DebugModule.prefix("TagFilter.svelte");

    export function addTag(tag: TagInstance) {
        debug.prefix("#addTag()", tag);

        tag.getKey().then((key) =>
            tagfilter.update((lst) => {
                debug.prefix("#tagfilter.update()", lst, key);
                if (lst.indexOf(key) == -1)
                    lst.push(key);

                return lst;
            })
        );
    }
</script>

<script lang="ts">
    import { slide } from "svelte/transition";
    import Tag from "./Tag.svelte";
    import TagInput from "./TagInput.svelte";
    import TagEdit from "./TagEdit.svelte";

    import { hasPassword } from "../data/Lock";
    import type { TagInstance, TagInstanceStore } from "../data/TagManager";

    const debug = DebugModule.prefix("TagFilter.svelte");

    $: visible = $hasPassword && !$key ? false : $tagfilter.length > 0;
    $: debug.log("visible changed", visible);

    $: debug.log("tagfilter changed", $tagfilter);

    let tagInput = "";

    const onAddTag = async (ev: CustomEvent) => {
        let oTag: TagInstance = ev.detail.object;
        addTag(oTag);
        tagInput = "";
    };

    const removeTag = async (oTag: TagInstanceStore) => {
        const _debug = debug.prefix("#removeTag()", oTag, $tagfilter);
        if ($edittag == oTag) $edittag = undefined;

        const tagkey = await oTag.object.getKey();
        _debug.log("got key", tagkey);

        $tagfilter = $tagfilter.filter((t) => t != tagkey);
    };
</script>

<a role="button" href={"#"} on:click|preventDefault={() => (visible = !visible)}
    >Tags</a
>

{#if visible}
    <TagInput bind:value={tagInput} on:submit={onAddTag} />

    <TagEdit />

    <section class="taglist" class:open={visible} transition:slide>
        {#key $tagfilter} {#if $tagfilter.length}
            {#each $tagfilter as tag}
                <Tag
                    key={tag}
                    on:remove={(ev) => removeTag(ev.detail)}
                    on:click={(ev) => {
                        console.log(ev.detail, $edittag, edittag);
                        edittag.set(
                            edittag && $edittag == ev.detail
                                ? undefined
                                : ev.detail
                        );
                    }}
                />
            {/each}
        {:else}
            No Tags yet
        {/if} {/key}
    </section>
{/if}

<style>
    A[role="button"] {
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
