import type { Readable, Subscriber, Unsubscriber } from "svelte/store"
import { db } from "../lib/database"
import { SvelteObjectStore } from "../lib/SvelteObjectStore"
import Cryptography, { EncryptedData } from "../lib/cryptography"

import { key } from '../components/Lock.svelte'

const _db = await db;

const module_version = 1;
const empty_hash = await Cryptography.sha256("", true) as string;


let currentKey = undefined;


export class TagsError extends Error {
    static readonly EMPTY_TAG_KEY = "the given value resulted in an empty tag-key";
    static readonly NO_TAG_FOR_KEY = "a tag for the given Key or Value does not exist in the Database";
    static readonly INVALID_CONSTRUCT = "construct must be provided with either 'key' or 'value'";
}

export class ITag {
    public key: string
    public value: string
    public color?: string;
    public version?: number;
    public data?: string // only exists, when the tag is encrypted

    static async createNew(value: string, color: string = '#73828c') {
        const key = await Cryptography.sha256(getKey(value), true) as string
        return new ITag({ value, key, color, version: module_version })
    }

    constructor(
        payload: Partial<ITag>
    ) {
        if (!payload.key || !payload.key.trim().length || payload.key.trim() == empty_hash)
            throw new TagsError(TagsError.EMPTY_TAG_KEY);

        this.key = payload.key;
        if (payload.data) {
            this.data = payload.data;
            this.value = "*******";
        }
        else {
            this.value = payload.value || "corrupted tag"
            this.color = payload.color || '#73828c'; 
            this.version = payload.version || 0; 
        }
    }

    async drop(): Promise<void> {
        await _db.tags.delete(this.key)

        const tagUpdates = [];
        await _db.todos.where("tags").equals(this.key).each((e) => {
            e.tags = e.tags.filter(t => t != this.key)
            tagUpdates.push(e);
        })

        await _db.todos.bulkPut(tagUpdates);

        tagsstore.refresh();
    }

    insert(): Promise<void> {
        return _db.tags.put(this).then(() => tagsstore.refresh());
    }

    async unlock(key: CryptoKey) {
        if (this.data) {
            const tagdata = JSON.parse((new TextDecoder()).decode(await Cryptography.synckey.decrypt(
                EncryptedData.fromBase64(this.data),
                key
            )));

            this.value = tagdata.value;
            this.color = tagdata.color;
            this.version = tagdata.version;
        }

        return this;
    }

    async lock() {
        if (this.data) {
            this.value = "*******";
            delete this.color
            delete this.version
        }

        return this;
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
    return _db.tags.where("key").equals(key).first().then(e => {
        if (!e) {
            console.log(key)
            throw new TagsError(TagsError.NO_TAG_FOR_KEY)
        }
        else return getTagStore(e);
    })
}

function findByValue(value: string): Promise<TagStore> {
    return Cryptography.sha256(getKey(value), true)
        .then( (key: string) => findByKey(key) )
        .catch(err => {
            console.error("for value", value)
            throw err;
        })
}

async function encryptAll(key: CryptoKey, oldkey: CryptoKey = undefined) {
    let newtags = [];
    if (key && oldkey) {
        await _db.tags.each(async tag => {
            const tagdata = JSON.parse((new TextDecoder()).decode(await Cryptography.synckey.decrypt(
                EncryptedData.fromBase64(tag.data),
                oldkey
            )));

            newtags.push({
                key: tag.key,
                data: (await Cryptography.synckey.encrypt(
                    (new TextEncoder()).encode(JSON.stringify({
                        value: tagdata.value,
                        color: tagdata.color,
                        version: tagdata.version
                    }))
                    , key
                )).toBase64()
            });
        })
    }
    else if (key) {
        await _db.tags.each(async tag => {
            if(tag.data) throw new Error("tag already encrypted")
            newtags.push({
                key: tag.key,
                data: (await Cryptography.synckey.encrypt(
                    (new TextEncoder()).encode(JSON.stringify({
                        value: tag.value,
                        color: tag.color,
                        version: tag.version
                    }))
                    , key
                )).toBase64()
            });
        })
    }
    else if(oldkey) { 
        await _db.tags.each(async tag => {

            const tagdata = JSON.parse((new TextDecoder()).decode(await Cryptography.synckey.decrypt(
                EncryptedData.fromBase64(tag.data),
                oldkey
            )));

            newtags.push({
                key: tag.key,
                value: tagdata.value,
                color: tagdata.color,
                version: tagdata.version
            });
        })
    }

    if(newtags.length) await _db.tags.bulkPut(newtags)
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

    encryptAll: (key: CryptoKey, oldkey?: CryptoKey) => Promise<void>
}


export const tagsstore = new TagsStore()

export const Tags: ITagsModule = {getTagStore, tagsstore, findByKey, findByValue, encryptAll }

export default Tags



//==============================================================================
// Helpers
//==============================================================================
async function table() { return (await db).tags }

function getKey(value: string) { return (value||"").trim().toLowerCase() }



//==============================================================================
// Data Init
//==============================================================================
await Promise.all(
    (await _db.tags.toArray()).map( async e => {
        const oTag = new ITag(e);
        switch (oTag.version) {
            case module_version:
            default: break;

            case 0:
                const oTagOrig = new ITag(e)
                const newkey = await Cryptography.sha256(oTag.key, true) as string
                const oldkey = oTag.key

                console.log("update key: ", oldkey, newkey)
                let todos = await _db.todos.where("tags").anyOf(oldkey).distinct().toArray()

                todos = todos.map(todo => {
                    todo.tags = todo.tags.map(todotag => todotag == oldkey ? newkey : todotag)
                    return todo
                })

                await _db.todos.bulkPut(todos)
                await oTagOrig.drop();
                oTag.key = newkey

            case 99999999999999:
                console.log("tag update: ", oTag.version, "=>", module_version)
                oTag.version = module_version; 
                await oTag.insert();
        }
    
    })
);

key.subscribe((key: CryptoKey) => {
    console.log("key changed", key);
    currentKey = key; 

    if(key)
        tagStores.forEach(async ts => { 
            ts.object = await ts.object.unlock(key);
        })
    else
        tagStores.forEach(async ts => { 
            ts.object = await ts.object.lock();
        })

})