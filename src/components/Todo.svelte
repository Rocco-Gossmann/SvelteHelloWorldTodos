<script lang="ts">    

    import Todos, { type ITodo } from "../data/Todos";
    import type { ITag } from '../data/Tags';

    import Tag from './Tag.svelte';
    import { addTag } from './TagInput.svelte';
    import { toast } from '../lib/components/Toast.svelte';

    export let todo: ITodo;

    const dropTodo = ( todo ) => {
        if(confirm("remove todo permanently ?"))
            Todos.remove(todo);
    }

    const toggleDone = async (todo: ITodo) => {
        todo.done = !todo.done; 
        Todos.set(todo)
    }

    const onTagClick = async (tag: ITag) => {
        try { addTag(tag); }
        catch( err ) {
            toast("cant add tag (See Console)", "alert", 2);
        }
    }

    const onTagRemove = async (ev: CustomEvent) => {
        if(confirm("remove Tag?")) {
            const oTag: ITag = ev.detail;
            todo.tags = todo.tags.filter( (t) => t != oTag.key );
            Todos.set(todo);
        }

    }

</script>

<article 
    class:done={todo.done} 
>
    <span><input type="checkbox" 
        bind:checked={todo.done} 
        on:click={() => toggleDone(todo)} /></span>

    <span class="txt">{todo.description}</span>


    <button on:click|preventDefault={() => dropTodo(todo)} 
        class="fa fa-trash-can" title="delete"></button>

    <ul>
        {#each todo.tags as tag}
        <li><Tag 
            key={tag} 
            on:click={(ev) => onTagClick(ev.detail)} 
            on:remove={onTagRemove}
            noremove={todo.done}/></li>
        {/each}
    </ul>
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
        display: flex;
        margin-bottom: 0px;
        grid-column: 1 / -1;
    }

    UL LI {
        display: inline-block;
        margin: calc(var(--block-spacing-vertical) / 4) var(--block-spacing-horizontal);
    }

</style>