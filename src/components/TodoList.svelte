<script lang="ts">
    import { todos, type ITodo } from "../data/Todos";

    $: displayList = [ ...$todos ].reverse();
   
    const dropTodo = ( todo ) => {
        console.log(todo);
        if(confirm("remove todo permanently ?"))
            $todos = $todos.filter( (t) => t != todo );
    }

</script>

{#each displayList as todo,i (i)}
<article class:done={todo.done}>
    <span><input type="checkbox" 
        bind:checked={todo.done} 
        on:click={() => {todo.done = !todo.done; $todos = $todos}} /></span>

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
