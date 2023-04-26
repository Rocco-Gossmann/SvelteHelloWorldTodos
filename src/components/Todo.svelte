<script lang="ts">
    import { addTag } from "./TagFilter.svelte";
    import { toast } from "../lib/components/Toast.svelte";
    import TagInput from "./TagInput.svelte";
    import Tag from "./Tag.svelte";

    import DebugModule from "../lib/debug";
    import type { TagInstanceStore } from "../data/TagManager";
    import { TodoManager, type TodoInstanceStore } from "../data/TodoManager";

    import tagfilter from "../data/TagFilter";
    import { key } from "../data/Lock";

    const debug = DebugModule.prefix("Todo.svelte");

    export let todo: TodoInstanceStore;

    let showTagInput = false;

    const dropTodo = () => {
        if (confirm("remove $todo.permanently ?")) TodoManager.dropEntry(todo);
    };

    async function updateTodo(ul: boolean = false) {
        await TodoManager.updateEntry(todo, $todo, $key)
        if(ul) await TodoManager.updateList($tagfilter, $key)
    }

    const toggleDone = async () => {
        $todo.done = !$todo.done;
        await updateTodo(true);
    };

    const onTagClick = async (tag: TagInstanceStore) => {
        try {
            addTag(tag.object);
        } catch (err) {
            toast("cant add tag (See Console)", "alert", 2);
        }
    };

    const onTagRemove = async (ev: CustomEvent<TagInstanceStore>) => {
        debug.prefix("#onTagRemove()", ev);
        if (confirm("remove Tag?")) {
            const oTag = ev.detail;
            const key = await oTag.object.getKey();
            $todo.tags = $todo.tags.filter((t) => t != key);
            await updateTodo();
        }
    };

    const onTagAdd = async (ev: CustomEvent<TagInstanceStore>) => {
        debug.prefix("#onTagAdd()", ev);
        const oTag = ev.detail;
        debug.log("got tag", oTag);
        const key = await oTag.object.getKey();
        if ($todo.tags.indexOf(key) == -1) {
            $todo.tags.push(key);
        }
        await updateTodo();

        showTagInput = false;
    };
</script>

<article class:done={$todo.done}>
    <span
        ><input
            type="checkbox"
            bind:checked={$todo.done}
            on:click={() => toggleDone()}
        /></span
    >

    <span class="txt">{$todo.description}</span>

    <button
        on:click|preventDefault={() => dropTodo()}
        class="fa fa-trash-can"
        title="delete"
    />

    <ul>
        {#each $todo.tags as tag}
            <li>
                <Tag
                    key={tag}
                    on:click={(ev) => onTagClick(ev.detail)}
                    on:remove={onTagRemove}
                    noremove={$todo.done}
                />
            </li>
        {/each}
    </ul>

    {#if !$todo.done}
        <button
            on:click|preventDefault={() => (showTagInput = !showTagInput)}
            class="fa fa-tag"
            title="new Tag"
        />

        {#if showTagInput}
            <div class="taginput">
                <TagInput on:submit={onTagAdd} />
            </div>
        {/if}
    {/if}
</article>

<style>
    ARTICLE {
        display: grid;
        padding: calc(var(--spacing) * 2);
        grid-template-columns: 0fr 1fr 0fr;
    }

    article.done > .txt {
        text-decoration: line-through;
        color: silver;
    }

    UL {
        margin-bottom: 0px;
        grid-column: 1 / -2;
    }

    ARTICLE > DIV.taginput {
        grid-column: 1 / -1;
    }

    UL LI {
        display: inline-block;
        margin: calc(var(--block-spacing-vertical) / 4)
            var(--block-spacing-horizontal);
    }
</style>
