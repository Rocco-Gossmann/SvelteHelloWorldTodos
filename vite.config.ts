import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa' 
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), VitePWA({
    registerType: "autoUpdate",
    base: "/SvelteHelloWorldTodos/",  
    manifest: {
      name: "HelloWorld-Todos",
      short_name: "HWTodos",
      id: "de.roccogossmann.svelte.helloworldtodos",
      "icons": [
        {
          src: "/vite.svg",
          sizes: "512x512" 
        }
      ] 
    }
  })],
  build: {
    outDir: "./docs",
  }
})
