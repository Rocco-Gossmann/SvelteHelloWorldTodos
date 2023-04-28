<script lang="ts">
    import { toast } from '../lib/components/Toast.svelte';
    import { tagfilter } from '../data/TagFilter';
    import { TodoManager, type TodoInstance } from '../data/TodoManager';
    import { key } from '../data/Lock';

    import DebugModule from '../lib/debug';

    const debug = DebugModule.prefix("TodoInput.svelte");

    let todo: Partial<TodoInstance> = {
        description: '',
        done: false,
        tags: []
    };
    

    $: todo.tags = [ ...$tagfilter ];

    const addTodo = () => {
        const _debug = debug.prefix("#addTodo()", todo)
        todo.description = todo.description.trim();

        if (todo.description == '') {
            toast("noting to add", "alert", 2);
        } else {
            TodoManager.createNewEntry(todo, $key)
                .then( store => { TodoManager.updateList() })

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
