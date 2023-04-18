import Dexie from "../assets/vendor/dexiejs/dexie"

export const db = new Dexie("helloworldtodos", {});
db.version(2).stores({
    tags: "&key",
    todos: "++id,*tags",
})

export default db