<script lang="ts">    
    import type { ITag, TagStore } from '../data/Tags';

    import Tag from './Tag.svelte';
    import { addTag } from './TagFilter.svelte';
    import { toast } from '../lib/components/Toast.svelte';
    import TagInput from "./TagInput.svelte";

    import TodoManager from './../data/TodoManager'


    export let todo; 

    $: todos = TodoManager.store

    let showTagInput = false;

    const dropTodo = ( todo ) => {
//        if(confirm("remove todo permanently ?"))
//            Todos.remove(todo);
    }
//
    const toggleDone = async () => {
       $todo.done = !$todo.done; 
       $todos = $todos;
    }
//
    const onTagClick = async (tag) => {
//        try { addTag(tag.object); }
//        catch( err ) {
//            toast("cant add tag (See Console)", "alert", 2);
//        }
    }
//
    const onTagRemove = async (ev: CustomEvent) => {
//        if(confirm("remove Tag?")) {
//            const oTag: TagStore = ev.detail;
//            todo.tags = todo.tags.filter( (t) => t != oTag.object.key );
//            Todos.set(todo);
//        }
//
    }
//
    const onTagAdd = async (ev: CustomEvent) => {
//        const oTag: TagStore = ev.detail; 
//
//        if(todo.tags.indexOf(oTag.object.key) == -1) {
//            todo.tags.push(oTag.object.key);
//            Todos.set(todo);
//        }
//
//        showTagInput = false;
    }

</script>

<article 
    class:done={$todo.done} 
>
    <span><input type="checkbox" 
        bind:checked={$todo.done} 
        on:click={() => toggleDone($todo)} /></span>

    <span class="txt">{$todo.description}</span>

    <button on:click|preventDefault={() => dropTodo(todo)} 
        class="fa fa-trash-can" title="delete"></button>

    <ul>
        {#each $todo.tags as tag}
        <li><Tag 
            key={tag} 
            on:click={(ev) => onTagClick(ev.detail)} 
            on:remove={onTagRemove}
            noremove={$todo.done}/></li>
        {/each}
    </ul>

    {#if !$todo.done}
        <button on:click|preventDefault={() => showTagInput = !showTagInput} 
            class="fa fa-tag" title="new Tag"></button>

        {#if showTagInput}
            <div class="taginput">
                <TagInput on:submit={onTagAdd}/>
            </div>
        {/if}
    {/if}

</article>

<style>
    ARTICLE {
        display: grid;
        padding: calc( var(--spacing) * 2 );
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
        margin: calc(var(--block-spacing-vertical) / 4) var(--block-spacing-horizontal);
    }

</style>
