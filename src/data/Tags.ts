import { db } from "../lib/database"
export class TagsError extends Error { 
    static readonly EMPTY_TAG_KEY = "the given value resulted in an empty tag-key";

    static readonly NO_TAG_FOR_KEY = "a tag for the given Key or Value does not exist in the Database";

}

export class ITag { 
    public key: string;

    /**
     * @param value  the visible representation of the tag
     */
    constructor(
        public value: string
    ) {
        this.key = getKey(value);
        if (this.key == "") throw new TagsError(TagsError.EMPTY_TAG_KEY);
    }

    async drop(): Promise<void> { 

        const _db = await db;
        const oTag = await _db.tags(this.key).first();

        if(oTag)
            await _db.tags.delete(this.key);

        await _db.todos.where("tags").equals(this.key).each((e) =>{ 
            e.tags = e.tags.filter(t => t != this.key); 
            return _db.todos.put(e);
        });

    }

    insert(): Promise<void> {
        return table().then(tab => tab.put(this));
    }
}


function findByKey(key: string): Promise<ITag> { 
    return db.then(db => db.tags.where("key").equals(key).first()).then(e => { 
        if (!e) throw new TagsError(TagsError.NO_TAG_FOR_KEY)
        else return e;
    });
}

function findByValue(value: string): Promise<ITag> { 
    return findByKey(getKey(value));
}

//==============================================================================
// Module Exports
//==============================================================================
interface ITagsModule {
    findByValue: (tag: string) => Promise<ITag>

    findByKey: (tag: string) => Promise<ITag>
}


export const Tags: ITagsModule = { findByKey, findByValue  }

export default Tags





//==============================================================================
// Helpers
//==============================================================================
async function table() { return (await db).tags }

function getKey(value: string) { return value.trim().toLowerCase(); }