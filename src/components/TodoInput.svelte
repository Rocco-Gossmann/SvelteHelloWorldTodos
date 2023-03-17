<script lang="ts">
    import Todos, { todos, type ITodo } from '../data/Todos';
    import { toast } from '../lib/components/Toast.svelte';
    import { tagfilter } from './TagFilter.svelte';

    let todo: ITodo = {
        description: '',
        done: false,
        tags: []
    };
    

    $: todo.tags = [ ...$tagfilter ];

    const addTodo = () => {
        if (todo.description.trim() == '') {
            toast("noting to add", "alert", 2);
        } else {
            todo.description = todo.description.trim();
            Todos.set(todo);
            todo = { description: '', done: false, tags: todo.tags };
        }
    };

</script>

<div>
    <form on:submit|preventDefault={addTodo}>
        <input tabindex="0" type="text" bind:value={todo.description} />
        <button type="submit" class="fa fa-circle-plus"></button>
    </form>
</div>

<style>
    BUTTON {
        white-space: nowrap;
    }

    FORM {
        display: grid;
        grid-gap: var(--spacing);
        grid-template-columns: 1fr 0fr 0fr;
    }
</style>
