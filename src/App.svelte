<script lang="ts">
    import './assets/main.css'

    import TagDataList from './components/TagDataList.svelte';

	import TagFilter from './components/TagFilter.svelte';
    import TodoInput from './components/TodoInput.svelte';
    import TodoList from './components/TodoList.svelte';
    import Toast from './lib/components/Toast.svelte';
    import ViteUpdatePrompt from './lib/components/ViteUpdatePrompt.svelte';
    import Lock from './components/Lock.svelte';
    import {key, hasPassword} from './data/Lock';
    import JsonExport from './components/JSONExport.svelte';

</script>

<svelte:head>
    <base href="/SvelteHelloWorldTodos"/>
</svelte:head>

<nav>
    <ul>
        <li><strong>HelloWorld Todo's</strong></li>
    </ul>
    <ul>
        <li><a href="https://github.com/Rocco-Gossmann/SvelteHelloWorldTodos" target="_blank">GitHub</a></li>
    </ul>
</nav>


<Lock />

{#if $hasPassword && !$key}
    please enter your password first
{:else}

    <JsonExport />

    <TagFilter />

    <h1 class="text-center">Todos</h1>

    <TodoInput />

    <TodoList />

    <TagDataList />
{/if}

<Toast />
<ViteUpdatePrompt />
