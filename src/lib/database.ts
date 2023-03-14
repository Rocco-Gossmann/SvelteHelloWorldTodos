//@ts-ignore  
// Dexie was importent in App.svelte
export const db = new Dexie("helloworldtodos", {})

db.version(1).stores({
    todos: "++id"
})