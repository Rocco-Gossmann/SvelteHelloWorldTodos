<script lang="ts">
    import './assets/main.css'
    import './assets/vendor/picocss/pico.min.css'
    import './assets/vendor/dexiejs/dexie.js'

	import TagInput from './components/TagInput.svelte';
    import TodoInput from './components/TodoInput.svelte';
    import TodoList from './components/TodoList.svelte';
    import Toast from './lib/components/Toast.svelte';
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
<Toast />

<TagInput />

<h1 class="text-center">Todos</h1>

<TodoInput />

<TodoList />
