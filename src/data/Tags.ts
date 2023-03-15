import { db } from "../lib/database"

export interface ITag {
    /* Normalized version of value (trimmed and strtolowered) */
    key: string 
    /* Visible value, as entered by the User */
    value: string
}

async function table() { return (await db).tags }

async function insert(value: string) {
    const key = getKey(value);
    const oTag: ITag = { key, value };

    (await table()).put(oTag);

    return oTag
}

function getKey(value: string) { 
    return value.trim().toLowerCase();
}

function findByValue(value: string): Promise<ITag> { 
    const key = getKey(value)
    return db.then(db => db.tags.where("key").equals(key).first()).then(e => { 
        if (!e) throw new Error("no tag for value " + value)
        else return e;
    });
}

async function drop(value: string) {
    const key = getKey(value);
    const _db = await db;

    const oTag = await _db.tags(key).first();

    if(oTag)
        await _db.tags.delete(key);

    await _db.todos.where("tags").equals(key).each((e) =>{ 
        e.tags = e.tags.filter(t => t != key); 
        return _db.todos.put(e);
    });

    return oTag
}

//==============================================================================
// Module Exports
//==============================================================================
interface ITagsModule {
    insert: (tag: string) => Promise<ITag|void>
    drop: (tag: string) => Promise<ITag|void>
    getKey: (tag: string) => string

    findByValue: (tag: string) => Promise<ITag>
}


export const Tags: ITagsModule = { getKey, findByValue, insert, drop }

export default Tags