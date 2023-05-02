import db from "../lib/database";
import { DataGroup, DataSet, type PrimaryKey } from '../lib/DBDataGroup';;
import cryptography from "../lib/cryptography";

class CTagManager extends DataGroup {
    constructor() {
        super(db.tags, "key")
    }

    definePKByValue(value: string): Promise<string> {
        let keybase = value.trim().toLowerCase();
        if(keybase == "") throw Error("cant define key for empty value");
        return cryptography.sha256(keybase, true) as Promise<string> 
    }

}

export const TagManager = new CTagManager();
export default TagManager
