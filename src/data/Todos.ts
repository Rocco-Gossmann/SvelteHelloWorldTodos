import type { Readable, Subscriber, Unsubscriber } from 'svelte/store'
import { isArray, isObject } from '../lib/utils'

//==============================================================================
// Interfaces
//==============================================================================
export interface ITodo {
    id?: number
    description: string
    done: boolean
}

class TodoStore implements Readable<ITodo[]> { 

    private subs: Set<Subscriber<ITodo[]>> = new Set();

    subscribe = (run: Subscriber<ITodo[]>): Unsubscriber => {
        run(this._dat());
        this.subs.add(run);
        return () => { this.subs.delete(run) }
    }

    refresh() {
        const dat = this._dat()
        this.subs.forEach(fnc => fnc(dat))
    }

    private _dat(): ITodo[] {
        return Array.from(aTodos.values());
    }
}

//==============================================================================
// Module Functions
//==============================================================================
const localStorageName = "rawTodos";
const aTodos: Map<number, ITodo> = new Map(); 
let autoIncrement = 0;

function isTodo(obj: any): obj is ITodo {
    return isObject(obj)
        && typeof (obj.description) === "string"
        && typeof (obj.done) === 'boolean'
}

//==============================================================================
// Module Exports
//==============================================================================
export const todos = new TodoStore();

export function add(todo: ITodo, updateStore = true) { 
    if (!todo.id) todo.id = ++autoIncrement;
    aTodos.set(todo.id, todo);

    if (updateStore) todos.refresh()
}

export function remove(todo: ITodo, updateStore = true) { 
    aTodos.delete(todo.id);
    if (updateStore) todos.refresh()
}

interface ITodosModule {
    todos: TodoStore

    add: (todo: ITodo) => void; 

    remove: (todo: ITodo) => void
}
export const Todos: ITodosModule = { todos, add, remove }
export default Todos



//==============================================================================
// Module Exports Setup
//==============================================================================
if (localStorage) {
    let rawTodos: unknown
    try { rawTodos = JSON.parse(localStorage.getItem(localStorageName)) }
    catch (err) { 
        localStorage.removeItem(localStorageName)
        console.error("Error while initializing Todos: ", err)
    }

    if (isArray(rawTodos)) { 
        rawTodos = (rawTodos as Array<unknown>).filter((todo: unknown) => {
            if (!isTodo(todo)) return false
            if (todo.id) {
                if (typeof (todo?.id) === 'number') {
                    autoIncrement = Math.max(autoIncrement, todo.id)
                }
                else delete todo.id

            }
            return true;
        });


        (rawTodos as ITodo[]).forEach( t => add(t, false) )
    }

    todos.subscribe((todos: ITodo[]) => localStorage.setItem(localStorageName, JSON.stringify(todos)))
}


