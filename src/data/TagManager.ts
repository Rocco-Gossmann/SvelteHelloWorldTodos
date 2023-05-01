import { DatabaseInstance, DatabaseInstanceStore, DatabaseManager, type DBE } from "./CDatabaseManager"
import DB from '../lib/database'
import cryptography from "../lib/cryptography"
import DebugModule from "../lib/debug";
import type { Readable, Subscriber, Unsubscriber } from "svelte/store";

const debug = DebugModule.prefix("TagManager.ts");

const empty_hash = await cryptography.sha256("", true) as string;

export class TagError extends Error {
    static readonly EMPTY_TAG_KEY = "the given value resulted in an empty tag-key";
    static readonly NO_TAG_FOR_KEY = "a tag for the given Key or Value does not exist in the Database";
    static readonly INVALID_CONSTRUCT = "construct must be provided with either 'key' or 'value'";
    static readonly NEEDS_UNLOCK = "You need to unlock the app with your set password first.";
}

export class TagInstance extends DatabaseInstance{
    protected error(code: DBE, originalError: Error): Error { return originalError; }

    async getDatabaseData(): Promise<Object> {
        return {
            key: await this.keypromise,
            value: this.value,
            color: this.color,
            version: this.version,
            data: this.data
        }
    }

    key?: string;
    value: string;
    color?: string;
    version?: number;

    private keypromise: Promise<string>;

    constructor(payload: Partial<TagInstance>, generatePK=false) { super()

        this.version = payload?.version || 2; 

        if (payload?.data) {
            this.data = payload.data;
            this.value = payload?.value || "encrypted tag"
            this.locked = true;
        }
        else {
            this.data = "";
            this.color = payload?.color || '#73828c'; 
            this.value = payload?.value || "corrupted tag"
            this.locked = false;
        }

        if (!payload?.key || !payload?.key?.trim().length || payload?.key?.trim() == empty_hash) {
            if (!this.locked && generatePK) {
                this.keypromise = TagInstance.generatePrimaryKey(this.value)
                this.keypromise.then(k => this.key = k)
            }
            else this.keypromise = Promise.reject(new TagError(TagError.EMPTY_TAG_KEY));
        }
        else this.keypromise = Promise.resolve(payload?.key);
    }

    getKey(): Promise<string> { return this.keypromise; }

    static generatePrimaryKey(value: string): Promise<string> {
        const key = (value || "").trim().toLowerCase();
        const _debug = debug.prefix("#TagInstance.generatePrimarykey()", value);
       
        _debug.log("normlized key is", key); 
        
        if (!key) throw new TagError(TagError.EMPTY_TAG_KEY);
        return cryptography.sha256( key, true) as Promise<string>
    }

// Implement DatabaseInstance
    getPrimaryKey(): Promise<string> { return this.keypromise; }

}

export class TagInstanceStore extends DatabaseInstanceStore<TagInstance> {

    async updateInstanceData(data: Partial<TagInstance>): Promise<void> {
        this.object.color = data.color || this.object.color;
    }

}

class CTagManager extends DatabaseManager<TagInstance, TagInstanceStore> {
    protected async afterStoreUpdate(){ /** NOP */ }
    protected async afterStoreCreate(){ /** NOP */ }

    protected error(code: DBE, originalerror: Error): Error {
        switch(code) {
        case 'no_data_for_pk': 
            return new TagError(TagError.NO_TAG_FOR_KEY);

        default: 
            return originalerror; 
        }
    }

    protected async buildStoreFromData(data: Partial<TagInstance>, generateNew: boolean): Promise<TagInstanceStore> {
        return new TagInstanceStore(new TagInstance(data, generateNew), () => () => { });
    } 

    protected async afterStoreDrop(store: TagInstanceStore): Promise<void> {
        store.update(instance => {
            instance.value = "deleted tag";
            instance.color = undefined;
            return instance;
        })
        tagDataList.updateList();
    }

    constructor() { super(DB, "tags") }

}

export const TagManager = new CTagManager();
export default TagManager;
