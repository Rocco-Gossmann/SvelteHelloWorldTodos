import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  base: "/SvelteHelloWorldTodos/",

  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess()
}
