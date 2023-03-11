<script lang="ts">
    import { todos, type ITodo } from '../data/Todos';

    let todo: ITodo = {
        description: '',
        done: false,
    };

    const addTodo = () => {
        if (todo.description.trim() == '') {
            alert('nothing to add');
        } else {
            todo.description = todo.description.trim();
            $todos.push(todo);
            $todos = $todos;
            todo = { description: '', done: false };
        }
    };

</script>

<div>
    <input type="text" bind:value={todo.description} />
    <button on:click|preventDefault={addTodo}>+ add</button>
</div>

<style>
    BUTTON {
        white-space: nowrap;
    }

    DIV {
        display: grid;
        grid-gap: var(--spacing);
        grid-template-columns: 1fr 0fr 0fr;
    }
</style>
