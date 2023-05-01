import { writable, type Writable } from "svelte/store";
import db from "../lib/database";
import { DataGroup, DataSet, type PrimaryKey } from '../lib/DBDataGroup';;

class CTagManager extends DataGroup {
    constructor() {
        super(db.tags)
    }
}

export const TagManager = new CTagManager();
export default TagManager
