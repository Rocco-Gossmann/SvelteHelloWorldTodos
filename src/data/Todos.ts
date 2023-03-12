import { type Writable, writable, type Subscriber } from 'svelte/store'
import { isArray, isObject } from '../lib/utils'

//==============================================================================
// Interfaces
//==============================================================================
export interface ITodo {
    description: string
    done: boolean
}

//==============================================================================
// Module Functions
//==============================================================================
const localStorageName = "rawTodos";

function isTodo(obj: any): obj is ITodo {
    return isObject(obj)
        && typeof (obj.description) === "string"
        && typeof (obj.done) === 'boolean'
        && Object.entries(obj).length === 2
}

function isTodoArray(arr: unknown): arr is ITodo[] { 
    if (isArray(arr)) { 
        let isTodoArr = true;
        arr.forEach((e: any) => isTodoArr = (isTodoArr && isTodo(e)))

        return isTodoArr;
    }
    return false
}

function initStoreData(fnc: Subscriber<ITodo[]>) { 
    if(localStorage) {
        try {
            let rawTodos: unknown;
            if (isTodoArray(rawTodos = JSON.parse(localStorage.getItem(localStorageName))))
                fnc(rawTodos)
            else throw new Error(`content of localStorage.${localStorageName} is not a ITodo[]`);
        }
        catch (err) { 
            localStorage.removeItem(localStorageName)
            console.error("Error while initializing Todos: ", err)
        }
    }

    return () => { fnc([]); }
}

//==============================================================================
// Module Exports
//==============================================================================
export const todos = writable<ITodo[]>([], initStoreData);

interface ITodosModule {
    todos: Writable<ITodo[]>
}
export const Todos: ITodosModule = { todos }
export default Todos


//==============================================================================
// Module Exports Setup
//==============================================================================
if (localStorage) {
    todos.subscribe((todos: ITodo[]) => localStorage.setItem(localStorageName, JSON.stringify(todos)));
}


