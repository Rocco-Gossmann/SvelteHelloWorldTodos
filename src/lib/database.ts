import '../assets/vendor/dexiejs/dexie'

export const db = new Promise<Dexie>((resolve, reject) => {
    //@ts-ignore
    if (window?.Dexie) {
        //@ts-ignore => this if block litteraly checks if window.Dexie exists
        const db = new window.Dexie("helloworldtodos", {})
        db.version(1).stores({
            todos: "++id"
        })

        resolve(db)
    }
    else reject(new Error("Dexie is not loaded in window"))
})
