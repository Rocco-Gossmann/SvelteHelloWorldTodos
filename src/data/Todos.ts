import type { Readable, Subscriber, Unsubscriber } from 'svelte/store'
import { isArray, isObject } from '../lib/utils'
import { db } from '../lib/database'

//==============================================================================
// Interfaces
//==============================================================================
export interface ITodo {
    id?: number
    description: string
    done: boolean
    tags?: string[]
}


class TodoStore implements Readable<ITodo[]> {

    private subs: Set<Subscriber<ITodo[]>> = new Set();

    subscribe = (run: Subscriber<ITodo[]>): Unsubscriber => {
        run([]);
        (async () => run((await this._dat()) || []))()
        this.subs.add(run)
        return () => { this.subs.delete(run) }
    }

    async refresh() {
        const dat = (await this._dat()) || []
        this.subs.forEach(fnc => fnc(dat))
    }

    private _dat = (): Promise<ITodo[]> => db.then(db => {
        if (tagFilter.length) {
            return db.todos.where("tags").anyOf(tagFilter).distinct().filter((todo) => {
                const ret = tagFilter
                    .reduce((ok, e, i) => ok && todo.tags.indexOf(e) != -1, true)

                return ret;
            }).toArray()
        }
        else return db.todos.toArray();
    })
}

//==============================================================================
// Module Functions
//==============================================================================

function isTodo(obj: any): obj is ITodo {
    return isObject(obj)
        && typeof (obj.description) === "string"
        && typeof (obj.done) === 'boolean'
}

//==============================================================================
// Module Exports
//==============================================================================
export const todos = new TodoStore();
let tagFilter = [];

export async function set(todo: ITodo, updateStore = true) { 
    // make sure no undefined tags make it into the DB
    if (todo.tags)
        todo.tags = todo.tags.filter(t => typeof (t) === 'string');
    await (await db).table("todos").put(todo)
    if (updateStore) await todos.refresh()
}

export async function remove(todo: ITodo, updateStore = true) { 
    await (await db).table("todos").delete(todo.id);
    if (updateStore) await todos.refresh()
}

export async function filter(tags: string[], updateStore = true) {
    tagFilter = tags
    if (updateStore) await todos.refresh()
}


interface ITodosModule {
    todos: TodoStore

    set: (todo: ITodo) => Promise<void>; 

    remove: (todo: ITodo) => Promise<void>

    filter: (tags: string[]) => void
}
export const Todos: ITodosModule = { todos, set, remove, filter }
export default Todos



//==============================================================================
// Module Exports Setup
//==============================================================================
// Migrate older LocalStorage to IndexedDB
if (localStorage) {

    const localStorageName = "rawTodos";

    // Transfere Todos From LocalStorage to IndexedDB
    let rawTodos: unknown
    try { rawTodos = JSON.parse(localStorage.getItem(localStorageName)) }
    catch (err) { 
        localStorage.removeItem(localStorageName)
        console.error("Error while initializing Todos: ", err)
    }

    if (isArray(rawTodos)) { 
        rawTodos = (rawTodos as Array<unknown>).filter(isTodo);
        if ((rawTodos as ITodo[]).length) db
            .then(db => db.table("todos").bulkPut(rawTodos))
            .then(() => {
                localStorage.removeItem(localStorageName);
            });
    }

}


