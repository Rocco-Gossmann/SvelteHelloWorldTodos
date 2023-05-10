import db from "../lib/database";
import { DataGroup, DataSet } from '../lib/DBDataGroup';
import cryptography from "../lib/cryptography";

export class TagData {
    key: string;
    color?: string;
    value: string;
    version: number;
}

export type Tag = DataSet<TagData>;

class CTagManager extends DataGroup<TagData> {

    protected async afterDrop(ds: DataSet<TagData>): Promise<any> {
        console.log("after drop");
        const key = ds.data.key;
        const updates = [];
        await db.todos.each( (todo) => {
            console.log("process todo ", todo);
            const i = todo.tags.indexOf(key);
            console.log("index", todo);
            if(i !== -1) {
                todo.tags.splice(i, 1);
                console.log("new tags", todo);
                updates.push(todo);
            }
        }); 

        await Promise.all( updates.map( (u) => db.todos.put(u) ));
        console.log("todos cleaned");
    }

    constructor() {
        super(db.tags, { idField: "key" })
    }

    definePKByValue(value: string): Promise<string> {
        let keybase = value.trim().toLowerCase();
        if(keybase == "") throw Error("cant define key for empty value");
        return cryptography.sha256(keybase, true) as Promise<string> 
    }

}

export const TagManager = new CTagManager();
export default TagManager
