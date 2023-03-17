<script lang="ts">
    import { slide, crossfade } from 'svelte/transition'
    import {flip} from 'svelte/animate'

    import Todos, { todos, type ITodo } from "../data/Todos";
    import { addTag } from './TagInput.svelte';
    import { toast } from '../lib/components/Toast.svelte';
    import Tag from './Tag.svelte';
    import type { ITag } from '../data/Tags';

    $: allList = [ ...$todos]
    $: openList = allList.filter((t)=>!t.done);
    $: doneList = allList.filter((t)=>t.done);
   
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

    const [crossSend, crossReceive] = crossfade({ fallback: slide })

</script>

{#each openList as todo (todo.id)}
<article class:done={todo.done} in:crossReceive|local={{key: todo.id}} out:crossSend={{key: todo.id}} animate:flip={{duration: 250}}>
    <span><input type="checkbox" 
        bind:checked={todo.done} 
        on:click={() => toggleDone(todo)} /></span>

    <span class="txt">{todo.description}</span>

    <button on:click|preventDefault={() => dropTodo(todo)} 
        class="fa fa-trash-can" title="delete"></button>

    <ul>
        {#each todo.tags as tag}
        <li><Tag key={tag} on:click={(ev) => onTagClick(ev.detail)} /></li>
        {/each}
    </ul>
</article>
{/each}

<h3>Done:</h3>
{#each doneList as todo (todo.id)}
<article class:done={todo.done}  in:crossReceive|local={{key: todo.id}} out:crossSend={{key: todo.id}}  animate:flip={{duration: 250}}>
    <span><input type="checkbox" 
        bind:checked={todo.done} 
        on:click={() => toggleDone(todo)} /></span>

    <span class="txt">{todo.description}</span>

    <button on:click|preventDefault={() => dropTodo(todo)} 
        class="fa fa-trash-can" title="delete"></button>

    <ul>
        {#each todo.tags as tag}
        <li>{tag}</li>
        {/each}
    </ul>
</article>
{/each}
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

    UL LI A {
        background-color: var(--muted-color);
        padding: calc(var(--spacing) / 4) var(--block-spacing-horizontal);
    }

</style>
