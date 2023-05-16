import db from "../lib/database";
import { DataGroup, DataSet } from '../lib/DBDataGroup';
import cryptography, { EncryptedData } from "../lib/cryptography";
import { writable, type Writable } from "svelte/store";

export class TagData {
    key: string;
    color?: string;
    value: string;
    version: number;
    data?: string;
}

export type Tag = DataSet<TagData>;

class CTagManager extends DataGroup<TagData> {

//==============================================================================
// Value-List
//==============================================================================
    /** A list of all availabile values in the current TagList 
    * (Mainly used for The Autocomplete Datalist right now */
    private valuesStore: Writable<string[]> = writable([]);

//==============================================================================
// Implement DataGroup
//==============================================================================
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

    protected async lockDataSet(data: Partial<TagData>, key: CryptoKey): Promise<object> {
        console.log("LockDataset", data, key);
        if(data.data) throw new Error("Data is already locked :-( ");

        data.data = (await cryptography.synckey.encrypt((new TextEncoder()).encode(JSON.stringify({
            value: data.value,
            color: data.color,
            version: data.version
        })), key)).toBase64()

        data.value = "encrypted tag";
        data.color = "#000000";
        data.version = 999999999;

        return data;
    }

    protected async unlockDataSet(data: Partial<TagData>, key: CryptoKey): Promise<object> {
        console.log("Unlock", data, key);
        if(!data.data) return data;

        let newData: Partial<TagData> = JSON.parse((new TextDecoder()).decode(await 
            cryptography.synckey.decrypt(
                EncryptedData.fromBase64(data.data),
                key
            )
        ));

        data.value = newData.value;
        data.color = newData.color;
        data.version = newData.version;

        delete data.data;
        return data;
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
