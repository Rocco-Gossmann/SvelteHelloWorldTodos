<script lang="ts">

    import { slide, crossfade } from 'svelte/transition'
    import {flip} from 'svelte/animate'

    import { todos } from "../data/Todos";
    import Todo from './Todo.svelte';

    $: allList = [ ...$todos]
    $: openList = allList.filter((t)=>!t.done);
    $: doneList = allList.filter((t)=>t.done);
   
    const [crossSend, crossReceive] = crossfade({ fallback: slide })

    const duration = 250
</script>

{#each openList as todo (todo.id)}
    <div animate:flip={{duration}} 
    in:crossReceive={{key: todo.id}} 
    out:crossSend={{key: todo.id}} 
    > 
    <Todo { todo } />
    </div>
{/each}

<h3>Done:</h3>
{#each doneList as todo (todo.id)}
    <div animate:flip={{duration}} 
    in:crossReceive={{key: todo.id}} 
    out:crossSend={{key: todo.id}} 
    > 
    <Todo { todo } />
    </div>
{/each}