//@ts-nocheck
export const db = new Promise<Dexie>((resolve, reject) => {
    if (window?.Dexie) {
        const db = new window.Dexie("helloworldtodos", {})
        db.version(2).stores({
            tags: "&key",
            todos: "++id,*tags",
        })

        resolve(db)
    }
    else reject(new Error("Dexie is not loaded in window"))
})
