import type { Table, Collection } from "dexie";
import { writable, type Writable } from "svelte/store";
import cryptography, { EncryptedData } from "../lib/cryptography";
import db from "../lib/database";
import { DataGroup, DataSet, type PrimaryKey } from '../lib/DBDataGroup';

import { tagfilter } from "./TagFilter";

interface TodoData {
    id: number,
    done: boolean,
    description: string,
    tags: string[],
    data?: string
}

type Todo = DataSet<TodoData>;

class CTodoManager extends DataGroup<TodoData> {
    
    private _store: Writable<Todo[]> = writable([]);

    async afterDrop(dataset:Todo) {
        this._store.update( store => {
            return store.filter( ds => ds.data.id != dataset.data.id );
        } )
    }

    constructor() { super(db.todos, { idField: "id" }) }
    
//==============================================================================
// Implement DataGroup 
//==============================================================================
    protected async lockDataSet(data: TodoData, key: CryptoKey): Promise<TodoData> {
        if(data.data) throw new Error("Data is already locked :-( ");
        
        data.data = (await cryptography.synckey.encrypt((new TextEncoder()).encode(JSON.stringify({
            description: data.description,
            done: data.done,
            tags: data.tags
        })), key)).toBase64()

        data.description = "encrypted todo";
        data.done = false;
        data.tags = [];

        return data;
    }

    protected async unlockDataSet(data: TodoData, key: CryptoKey): Promise<TodoData> {
        if(!data.data) return data;

        let newData: Partial<TodoData> = JSON.parse((new TextDecoder()).decode(await 
            cryptography.synckey.decrypt(
                EncryptedData.fromBase64(data.data),
                key
            )
        ));

        data.description = newData.description,
        data.done = newData.done,
        data.tags = newData.tags

        delete data.data;
        return data;
    }

//==============================================================================
// Methods
//==============================================================================
    async dropTag(key: string): Promise<void> {
        await db.todos.toCollection().modify( (todo: TodoData) => {
            const i = todo.tags.indexOf(key);
            if(i !== -1) 
                todo.tags.splice(i, 1);
        })

        this._store.update( (store) => {
            store.forEach( (todo: Todo) => {
                let obj = todo.data;
                let i = obj.tags.indexOf(key)
                if(i > -1)  {
                   obj.tags.splice(i, 1);
                    todo.data = obj
                }
            })
            return store;
        })
    }

    async filterStore(filter: string[]): Promise<void> {

        let query:any = db.todos;

        if(filter.length) {
            query = (query as Table).where("id").anyOf(
                await (query as Table).where("tags").anyOf(filter).primaryKeys()
            );

            if(filter.length > 1)
                query = (query as Collection).and( (ds:TodoData) => {
                    let ok = true;
                    for( let a = 0; a < filter.length; a++) {
                        if(ds.tags.indexOf(filter[a]) == -1) {
                            ok = false;
                            break;
                        }
                    } 
                    return ok;
                });

        }
        else query = query.toCollection()

        const keys = await (query as Collection).primaryKeys();
        const data: Todo[] = await Promise.all(keys.map( (k:number) => {
            let str = this.findByPK(k as PrimaryKey)
            return str;
        }))

        this._store.set(data);
    }

    async insert(data: Partial<TodoData>):Promise<any> {
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


tagfilter.subscribe( (list:string[]) => {
    TodoManager.filterStore(list);
})
 


export default TodoManager
