import type { Readable, Subscriber, Unsubscriber } from "svelte/store"
import { db } from "../lib/database"
import { SvelteObjectStore } from "../lib/SvelteObjectStore"
export class TagsError extends Error {
    static readonly EMPTY_TAG_KEY = "the given value resulted in an empty tag-key";

    static readonly NO_TAG_FOR_KEY = "a tag for the given Key or Value does not exist in the Database";

    static readonly INVALID_CONSTRUCT = "construct must be provided with either 'key' or 'value'";
}

export class ITag {
    public key: string
    public value: string
    public color?: string;

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

        this.color = payload.color || '#73828c'; 

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

        tagsstore.refresh();
    }

    insert(): Promise<void> {
        return table().then(tab => tab.put(this)).then( () => tagsstore.refresh() )
    }
}

export class TagStore extends SvelteObjectStore<ITag> { 

    constructor(tag: ITag) {
        super(tag, () => { 
            tagStores.set(tag.key, this);
            return () => tagStores.delete(tag.key);
        })
    }

    notifiySubscribers() { this.set(this.object); }

}

const tagStores: Map<string, TagStore> = new Map()

function getTagStore(tag: Partial<ITag>): TagStore { 
    const protoTag = new ITag(tag)

    if (tagStores.has(protoTag.key)) {
        return tagStores.get(protoTag.key)
    }
    else { 
        return new TagStore(protoTag);
    }
}

function findByKey(key: string): Promise<TagStore> {
    return db.then(db => db.tags.where("key").equals(key).first()).then(e => {
        if (!e) {
            console.log(key)
            throw new TagsError(TagsError.NO_TAG_FOR_KEY)
        }
        else return getTagStore(e);
    })
}

function findByValue(value: string): Promise<TagStore> {
    return findByKey(getKey(value))
}

class TagsStore implements Readable<TagStore[]> {
    private subs: Set<Subscriber<TagStore[]>> = new Set();

    subscribe(run: Subscriber<TagStore[]>): Unsubscriber {
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

    private _dat(): Promise<TagStore[]> {
        return table()
            .then( tab => tab.toArray() )
            .then( arr => arr.map((obj: Object) => getTagStore(obj)))
        
    }

}


//==============================================================================
// Module Exports
//==============================================================================
interface ITagsModule {
    tagsstore: TagsStore,

    findByValue: (tag: string) => Promise<TagStore>

    findByKey: (tag: string) => Promise<TagStore>

    getTagStore: (tag: Partial<ITag>) => TagStore
}


export const tagsstore = new TagsStore()

export const Tags: ITagsModule = {getTagStore, tagsstore, findByKey, findByValue }

export default Tags





//==============================================================================
// Helpers
//==============================================================================
async function table() { return (await db).tags }

function getKey(value: string) { return (value||"").trim().toLowerCase() }