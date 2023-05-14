import { writable, type Writable } from "svelte/store";
import db from "../lib/database";
import { DataGroup, DataSet, type PrimaryKey } from '../lib/DBDataGroup';

import { tagfilter } from "./TagFilter";

interface TodoData {
    id: number,
    done: boolean,
    description: string,
    tags: string[],
}

type Todo = DataSet<TodoData>;

class CTodoManager extends DataGroup<TodoData> {
    
    private _store: Writable<Todo[]>;


    async afterDrop(dataset:Todo) {
        this._store.update( store => {
            return store.filter( ds => ds.data.id != dataset.data.id );
        } )
    }

    constructor() {
        super(db.todos, { idField: "id" })
        this._store = writable([]);
        this.filterStore([]);
    }

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
            query = query.where("tags").anyOf(filter);

            if(filter.length > 1)
                query = query.filter( (ds:TodoData) => {
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

        const keys: string[] = await query.keys();
        this._store.set(await Promise.all(keys.map(k => {
            return this.findByPK(k as PrimaryKey)
        })))
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
