<script lang="ts">
    import { slide, crossfade } from 'svelte/transition'
    import {flip} from 'svelte/animate'

    import Todos, { todos, type ITodo } from "../data/Todos";

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

</style>
