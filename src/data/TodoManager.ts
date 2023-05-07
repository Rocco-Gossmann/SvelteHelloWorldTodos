import { writable, type Writable } from "svelte/store";
import db from "../lib/database";
import { DataGroup, DataSet, type PrimaryKey } from '../lib/DBDataGroup';;

interface Todo {
    id: number
    [attr:string]: any
}

class CTodoManager extends DataGroup {
    
    private _store: Writable<DataSet<Todo>[]>;

    async afterDrop(dataset:DataSet<Todo>) {
        this._store.update( store => {
            return store.filter( ds => ds.data.id != dataset.data.id );
        } )
    }

    constructor() {
        super(db.todos, "id")
        this._store = writable([]);

        db.todos.toCollection().keys().then(arr => {
            Promise.all(arr.map(e => {
                return this.findByPK(e as PrimaryKey)
            }))
                .then(stores => {
                    console.log("update stores with data", stores);
                    this._store.set(stores)
                })
        });
    }

    public get store() { return this._store; }
}

export const TodoManager = new CTodoManager();
export default TodoManager
