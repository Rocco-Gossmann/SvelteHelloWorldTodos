import '../assets/vendor/dexiejs/dexie'

export const db = new Dexie("helloworldtodos", { })

db.version(1).stores({
    todos: "++id"
})