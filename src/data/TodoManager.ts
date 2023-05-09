import { writable, type Writable } from "svelte/store";
import db from "../lib/database";
import { DataGroup, DataSet, type PrimaryKey } from '../lib/DBDataGroup';;

interface Todo {
    id: number,
    done: boolean,
    description: string,
}

class CTodoManager extends DataGroup {
    
    private _store: Writable<DataSet<Todo>[]>;

    async afterDrop(dataset:DataSet<Todo>) {
        this._store.update( store => {
            return store.filter( ds => ds.data.id != dataset.data.id );
        } )
    }

    constructor() {
        super(db.todos, { idField: "id" })
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

    async insert(data: Partial<Todo>):Promise<any> {
        data.id=Date.now()*1000 + Math.floor(Math.random()*800+100);
        const newDataSet = await this.update(data);
        this._store.update( stores => {
            stores.push(newDataSet)
            return stores;
        })
    }

    public get store() { return this._store; }
}

export const TodoManager = new CTodoManager();
export default TodoManager
