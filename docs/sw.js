if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let o={};const t=e=>i(e,c),d={module:{uri:c},exports:o,require:t};s[c]=Promise.all(n.map((e=>d[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-49032917.css",revision:null},{url:"assets/index-93b370e1.js",revision:null},{url:"index.html",revision:"69eccca9ba66cdf6efc852bd63d402e5"},{url:"js/vendor/dexiejs/dexie.js",revision:"2808538d6ebb922a6fff3e7e8c357541"},{url:"js/vendor/fontawesome/css/all.min.css",revision:"6386fb409d4a2abc96eee7be8f6d4cc4"},{url:"js/vendor/picocss/pico.min.css",revision:"5ab14aff9a410290c276bf63da3095ef"},{url:"registerSW.js",revision:"7ec63945dcf86b4bb4a3a6a7129b7143"},{url:"vite.svg",revision:"a5b1da65e9e7a2b80cccebc36e1bb358"},{url:"manifest.webmanifest",revision:"99cdfd01c9415f236dec2540a48d2fbc"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
