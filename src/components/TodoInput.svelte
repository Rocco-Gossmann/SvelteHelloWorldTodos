<script lang="ts">
    import { toast } from '../lib/components/Toast.svelte';
    import { tagfilter } from '../data/TagFilter';
    import TodoManager from '../data/TodoManager';

    let todo: ITodo = {
        description: "",
        done: false,
        tags: $tagfilter
    };
    

    $: todo.tags = [ ...$tagfilter ];

    const addTodo = async () => {
        if ((todo.description = todo.description.trim()) == '') {
            toast("noting to add", "alert", 2);
        } else {
            await TodoManager.insert(todo);
            todo.description = "";
            todo.tags.splice(0);
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
