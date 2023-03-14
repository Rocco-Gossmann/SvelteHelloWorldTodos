<script lang="ts">
    import Todos, { todos, type ITodo } from '../data/Todos';
    import { toast } from '../lib/components/Toast.svelte';

    let todo: ITodo = {
        description: '',
        done: false,
    };

    const addTodo = () => {
        if (todo.description.trim() == '') {
            toast("noting to add", "alert");
        } else {
            todo.description = todo.description.trim();
            Todos.add(todo);
            todo = { description: '', done: false };
        }
    };

</script>

<div>
    <input type="text" bind:value={todo.description} />
    <button on:click|preventDefault={addTodo} class="fa fa-circle-plus"></button>
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
