<script lang="ts">

    import { slide, crossfade } from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import Todo from './Todo.svelte';

    import TodoManager from '../data/TodoManager'

    $: todos = TodoManager.store; 
    $: openList = $todos.filter((t: any)=>{ console.log("openlist", t); return !t.data.done});
    $: doneList = $todos.filter((t: any)=>t.data.done);
   
    const [crossSend, crossReceive] = crossfade({ fallback: slide })

    const duration = 250
</script>

{#each openList as todo (todo.data.id)}
    <div animate:flip={{duration}} 
    in:crossReceive|local={{key: todo.data.id}} 
    out:crossSend|local={{key: todo.data.id}} 
    > 
    <Todo { todo } />
    </div>
{/each}

<h3>Done:</h3>
{#each doneList as todo (todo.data.id)}
    <div animate:flip={{duration}} 
    in:crossReceive|local={{key: todo.data.id}} 
    out:crossSend|local={{key: todo.data.id}} 
    > 
    <Todo { todo } />
    </div>
{/each}
