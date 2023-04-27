<script lang="ts">

    import { slide, crossfade } from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import Todo from './Todo.svelte';
    import {todolist,  TodoManager, type TodoInstanceStore} from '../data/TodoManager';
    import DebugModule from '../lib/debug';

    const debug = DebugModule.prefix("TodoList.svelte");
   
    $: debug.log("todolist changed", $todolist);

    $: openList = $todolist.filter((t:TodoInstanceStore)=>!t.object.done);
    $: doneList = $todolist.filter((t:TodoInstanceStore)=>t.object.done);

    $: debug.log("openlist:", openList.map( tis => tis.object.id ));
    $: debug.log("doneList:", doneList.map( tis => tis.object.id ));
   
    const [crossSend, crossReceive] = crossfade({ fallback: slide })

    const duration = 250
</script>

{#each openList as todo (todo.object.id)}
    <div animate:flip={{duration}} 
         in:crossReceive|local={{key: todo.object.id}} 
         out:crossSend|local={{key: todo.object.id}} 
    > 
        <Todo { todo } />
    </div>
{/each}

<h3>Done:</h3>
{#each doneList as todo (todo.object.id)}
    <div animate:flip={{duration}} 
    in:crossReceive|local={{key: todo.id}} 
    out:crossSend|local={{key: todo.id}} 
    > 
    <Todo { todo } />
    </div>
{/each}
