import '../assets/vendor/dexiejs/dexie';

//if (Dexie) { 
//    console.log("Dexie exists", Dexie)
//    window.Dexie = Dexie
//}

export const db = new Promise<Dexie>((resolve, reject) => {
    //@ts-ignore
    if (window?.Dexie) {
        //@ts-ignore => this if block litteraly checks if window.Dexie exists
        const db = new window.Dexie("helloworldtodos", {})
        db.version(2).stores({
            tags: "&key",
            todos: "++id,*tags",
        })

        resolve(db)
    }
    else reject(new Error("Dexie is not loaded in window"))
})
