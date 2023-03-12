<script lang="ts">
    import './assets/main.css'
    import '@picocss/pico'
    import TodoInput from './components/TodoInput.svelte';
    import TodoList from './components/TodoList.svelte';
</script>

<nav>
    <ul>
        <li><strong>HelloWorld Todo's</strong></li>
    </ul>
    <ul>
        <li><a href="https://github.com/Rocco-Gossmann/SvelteHelloWorldTodos" target="_blank">GitHub</a></li>
    </ul>
</nav>

<h1 class="text-center">Todos</h1>

<TodoInput />

<TodoList />
