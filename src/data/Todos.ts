import type { Readable, Subscriber, Unsubscriber } from 'svelte/store'
import { isArray, isObject } from '../lib/utils'
import { db } from '../lib/database'
import Cryptography, {EncryptedData} from '../lib/cryptography'
import { key, hasPassword } from './Lock';

let currentKey: CryptoKey;
key.subscribe( (k) => currentKey = k)

//==============================================================================
// Interfaces
//==============================================================================
export interface ITodo {
    id?: number
    tags?: string[]

    description: string
    done: boolean
    data?: string /** Encrypted Data */
}

const _db = await db;

class TodoStore implements Readable<ITodo[]> {

    private subs: Set<Subscriber<ITodo[]>> = new Set();

    subscribe = (run: Subscriber<ITodo[]>): Unsubscriber => {
        run([]);
        (async () => {
            const dat = await this._dat();
            console.log(dat);
            run(dat || [])
        }) ()
        this.subs.add(run)
        return () => { this.subs.delete(run) }
    }

    async refresh() {
        const dat = (await this._dat()) || []
        console.log(dat)
        this.subs.forEach(fnc => fnc(dat))
    }

    private _dat = async (): Promise<ITodo[]> => {
        let todos: ITodo[];

        if (tagFilter.length) {
            todos = await _db.todos.where("tags").anyOf(tagFilter).distinct().filter((todo) => {
                const ret = tagFilter
                    .reduce((ok, e, i) => ok && todo.tags.indexOf(e) != -1, true)

                return ret;
            }).toArray()
        }
        else todos = await _db.todos.toArray()

        if (currentKey) { 
            return await Promise.all(
                todos.map((todo: ITodo) => decryptTodo(currentKey, todo).then(dat => {
                    todo.done = dat.done;
                    todo.description = dat.description;
                    delete todo.data

                    return todo
                }))
            );
        }
        else {
            return todos.filter( (todo:ITodo) => todo.data === undefined);
        }
    }
        
        
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

    if (currentKey) {
        todo.data = await encryptTodo(currentKey, todo);
        delete todo.done;
        todo.description = "*******"
    }
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

async function encryptTodo(key: CryptoKey, todo: Partial<ITodo>) {
    return (await Cryptography.synckey.encrypt(
        (new TextEncoder()).encode(JSON.stringify({
            description: todo.description,
            done: todo.done
        }))
        , key
    )).toBase64()
}

async function decryptTodo(key: CryptoKey, todo: ITodo): Promise<ITodo> {

    if (!todo.data) {
        console.error("not encrypted", todo)
        throw new Error("todo is not encrypted")                
    }
    
    return JSON.parse((new TextDecoder()).decode(await Cryptography.synckey.decrypt(
        EncryptedData.fromBase64(todo.data),
        key
    )));

}

export async function encryptAll(key: CryptoKey, oldkey: CryptoKey): Promise<void> {
    let newTodos = [];

    if (key && oldkey) {
        await _db.todos.each(async (todo: ITodo) => {
            const tododata = await decryptTodo(oldkey, todo)

            const data = await encryptTodo(key, tododata)

            newTodos.push({
                id: todo.id,
                description: "*******",
                data,
                tags: todo.tags
            })
        })

    }
    else if (key) {
        await _db.todos.each(async (todo: ITodo) => {
            if (todo.data) {
                console.error(todo);
                throw new Error("todo already encrypted")
            }
            const data = await encryptTodo(key, todo)

            newTodos.push({
                id: todo.id,
                description: "*******",
                data,
                tags: todo.tags
            })

        })
    }
    else if (oldkey) {
        await _db.todos.each(async (todo: ITodo) => {
            const tododata = JSON.parse((new TextDecoder()).decode(await Cryptography.synckey.decrypt(
                EncryptedData.fromBase64(todo.data),
                oldkey
            )))

            newTodos.push({
                id: todo.id,
                description: tododata.description,
                done: tododata.done,
                tags: todo.tags
            })
        })
    }

    await _db.todos.bulkPut(newTodos);
}

interface ITodosModule {
    todos: TodoStore

    set: (todo: ITodo) => Promise<void>; 

    remove: (todo: ITodo) => Promise<void>

    filter: (tags: string[]) => void

    encryptAll: (key: CryptoKey, oldKey: CryptoKey) => Promise<void>
}
export const Todos: ITodosModule = { todos, set, remove, filter, encryptAll }
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

