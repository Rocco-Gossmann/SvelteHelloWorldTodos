<script lang="ts">
    import Tag from "./Tag.svelte";
    import { tagfilter } from "../data/TagFilter";
    import TagInput from "./TagInput.svelte";

    import TodoManager from "./../data/TodoManager";
    import type { DataSet } from "../lib/DBDataGroup";

    export let todo;

    $: todos = TodoManager.store;

    let showTagInput = false;

    const dropTodo = (todo:unknown) => {
        if(confirm("remove todo permanently ?"))
            TodoManager.drop(todo);
    };

    const toggleDone = async () => {
        $todo.done = !$todo.done;
        $todos = $todos;
    };

    const onTagClick = async (tag: DataSet<Tag>) => {
        const key = tag.data.key;
        if ($tagfilter.indexOf(key) == -1) {
            $tagfilter.push(key);
            $tagfilter = $tagfilter;
        }
    };

    const onTagRemove = async (ev: CustomEvent) => {
        if (
            $todo.tags.indexOf(ev.detail.data.key) != -1 &&
            confirm("remove Tag?")
        ) {
            $todo.tags = $todo.tags.filter((t: any) => t && t != ev.detail.data.key);
            $todo = $todo;
        }
    };

    const onTagAdd = async (ev: CustomEvent) => {
        console.log($todo.tags, ev.detail.data.key);
        if ($todo.tags.indexOf(ev.detail.data.key) == -1) {
            $todo.tags.push(ev.detail.data.key);
            $todo.tags = $todo.tags.filter((t: any) => t);
            $todo = $todo;
        }

        showTagInput = false;
    };
</script>

<article class:done={$todo.done}>
    <span
        ><input
            type="checkbox"
            bind:checked={$todo.done}
            on:click={() => toggleDone($todo)}
        /></span
    >

    <span class="txt">{$todo.description}</span>

    <button
        on:click|preventDefault={() => dropTodo(todo)}
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
