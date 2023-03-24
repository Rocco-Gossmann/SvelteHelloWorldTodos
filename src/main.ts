import App from './App.svelte'
import { registerSW } from 'virtual:pwa-register'

import { show_update_prompt } from './lib/components/ViteUpdatePrompt.svelte'

const app = new App({
  target: document.getElementById('app'),
})

const updateSW = registerSW({

  onNeedRefresh() {
    show_update_prompt.set(updateSW);
  },

  onOfflineReady() {
    alert("all is offline ready");
  }

})


export default app
