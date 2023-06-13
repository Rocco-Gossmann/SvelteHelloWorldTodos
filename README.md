# HelloWorld Todos

Todo Apps are kind of the "Hello World" when learning a new Framework

Use it yourself here => https://rocco-gossmann.github.io/SvelteHelloWorldTodos/
## Purpose
Help me to learn:
- The ins and outs of Svelte and npm
- How to best approach PWA development (Offline storage etc.)
- the transition from Javascript to TypeScript

## Roadmap
### Step 1 - Basics
- ✔️ Get a basic Todo App interface going
- ✔ Store Todos in LocalStorage
- ✔ Making the App Offline available (ServiceWorker)

### Step 1a - Make things look good
- ️✔ Find a better way, to send Toasts / Messages to the client (Alert Sucks)
- ✔ add some Font Awesome Goodness
- ✔ Animations

### Step 2 - More than a Todo List
- ✔ Setup IndexedDB => Store Todos there
- ✔ add Tags
  - ✔ assign tags 
  - ✔ filter todo list by tag
  - ✔ remove tags from todos
  - ✔ add more tags to existing todo
  - ✔ remove tags from app


### Step 3 - Security and Portability
- ✔ Figure out Encryption via WebCrypto-API
  - ✔ change how tags are identified, to make them encryptable, without them giving away their content
  - ✔ Add "Locking" and "Unlocking" mechanisms to the APP
    - ✔ encrypt Tags in the database
    - ✔ encrypt TODOs in the database
- ✔ export encrypted JSON containing all todos and tags 
- ✔ import encrypted JSON and restore IndexedDB from it

