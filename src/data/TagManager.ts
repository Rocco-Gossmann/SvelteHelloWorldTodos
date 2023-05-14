import db from "../lib/database";
import { DataGroup, DataSet } from '../lib/DBDataGroup';
import cryptography from "../lib/cryptography";
import { writable, type Writable } from "svelte/store";

export class TagData {
    key: string;
    color?: string;
    value: string;
    version: number;
}

export type Tag = DataSet<TagData>;

class CTagManager extends DataGroup<TagData> {

//==============================================================================
// Value-List
//==============================================================================
    /** A list of all availabile values in the current TagList 
    * (Mainly used for The Autocomplete Datalist right now */
    private valuesStore: Writable<string[]> = writable([]);

    protected async afterUpdate(data: Partial<TagData>): Promise<any> {
        this.valuesStore.update( store => {

            if(data?.value && store.indexOf(data.value) == -1)
                store.push(data.value);

            return store;
        })
    }

    protected async afterDrop(ds: DataSet<TagData>): Promise<any> {
        this.valuesStore.update( store => {
            let i = store.indexOf(ds.data.value);
            if(i != -1) store.splice(i, 1);
            return store;
        })
    }

//==============================================================================
// Main-Class
//==============================================================================
    constructor() {
        super(db.tags, { idField: "key" })

        const values = [];
        this.table.toCollection().each( (tag:TagData) => {
            values.push(tag.value); 
        }).then( () => {
            this.valuesStore.set(values);
        })
    }

    definePKByValue(value: string): Promise<string> {
        let keybase = value.trim().toLowerCase();
        if(keybase == "") throw Error("cant define key for empty value");
        return cryptography.sha256(keybase, true) as Promise<string> 
    }

    get values(): Writable<string[]> { return this.valuesStore }

}

export const TagManager = new CTagManager();
export default TagManager
