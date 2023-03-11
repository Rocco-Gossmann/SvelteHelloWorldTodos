import { type Writable, writable } from 'svelte/store'

//==============================================================================
// Interfaces
//==============================================================================
export interface ITodo {
    description: string
    done: boolean
}

export const todos = writable<ITodo[]>([]);

//==============================================================================
// Module Exports
//==============================================================================
interface ITodosModule {
    todos: Writable<ITodo[]>
}
export const Todos: ITodosModule = { todos }
export default Todos