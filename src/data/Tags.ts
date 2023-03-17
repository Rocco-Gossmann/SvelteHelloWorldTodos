import type { Readable, Subscriber, Unsubscriber } from "svelte/store"
import { db } from "../lib/database"
export class TagsError extends Error {
    static readonly EMPTY_TAG_KEY = "the given value resulted in an empty tag-key";

    static readonly NO_TAG_FOR_KEY = "a tag for the given Key or Value does not exist in the Database";

    static readonly INVALID_CONSTRUCT = "construct must be provided with either 'key' or 'value'";
}

export class ITag {
    public key: string
    public value: string

    constructor(
        payload: Partial<ITag>
    ) {
        if (payload.value && payload.key) {
            this.value = payload.value
            this.key = getKey(payload.key)
        }
        else if (payload.key) {
            this.value = payload.key
            this.key = getKey(payload.key)
        }
        else if (payload.value) {
            this.value = payload.value
            this.key = getKey(payload.value)
        }
        else throw new TagsError(TagsError.INVALID_CONSTRUCT)

        if (this.key == "") throw new TagsError(TagsError.EMPTY_TAG_KEY)
    }

    async drop(): Promise<void> {

        const _db = await db
        await _db.tags.delete(this.key)

        const tagUpdates = [];
        console.log(await _db.todos.where("tags").equals(this.key).each((e) => {
            e.tags = e.tags.filter(t => t != this.key)
            tagUpdates.push(e);
        }))

        await _db.todos.bulkPut(tagUpdates);

        tagstore.refresh();
    }

    insert(): Promise<void> {
        return table().then(tab => tab.put(this)).then( () => tagstore.refresh() )
    }
}

function findByKey(key: string): Promise<ITag> {
    return db.then(db => db.tags.where("key").equals(key).first()).then(e => {
        if (!e) {
            console.log(key)
            throw new TagsError(TagsError.NO_TAG_FOR_KEY)
        }
        else return new ITag(e);
    })
}

function findByValue(value: string): Promise<ITag> {
    return findByKey(getKey(value))
}

class TagStore implements Readable<ITag[]> {
    private subs: Set<Subscriber<ITag[]>> = new Set();

    subscribe(run: Subscriber<ITag[]>): Unsubscriber {
        console.log("new sub", run)
        this.subs.add(run)
        run([])

        this._dat().then(run)

        return () => {
            console.log("unsub", run)
            this.subs.delete(run)
        }
    }

    async refresh(): Promise<void> {
        const dat = await this._dat()
        this.subs.forEach(s => s(dat))
    }

    private _dat(): Promise<ITag[]> {
        return table()
            .then( tab => tab.toArray() )
            .then( arr => arr.map((obj: Object) => new ITag(obj)))
        
    }

}


//==============================================================================
// Module Exports
//==============================================================================
interface ITagsModule {
    tagstore: TagStore,

    findByValue: (tag: string) => Promise<ITag>

    findByKey: (tag: string) => Promise<ITag>
}

export const tagstore = new TagStore()

export const Tags: ITagsModule = { tagstore, findByKey, findByValue }

export default Tags





//==============================================================================
// Helpers
//==============================================================================
async function table() { return (await db).tags }

function getKey(value: string) { return value.trim().toLowerCase() }