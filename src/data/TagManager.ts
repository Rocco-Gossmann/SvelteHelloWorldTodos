import db from "../lib/database";
import { DataGroup, DataSet } from '../lib/DBDataGroup';
import cryptography from "../lib/cryptography";
import type { Writable } from "svelte/store";

export class TagData {
    key: string;
    color?: string;
    value: string;
    version: number;
}

export type Tag = DataSet<TagData>;

class CTagManager extends DataGroup<TagData> {

    private valuesStore: Writable<string[]>;

    constructor() {
        super(db.tags, { idField: "key" })

        

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
