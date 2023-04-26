import { DatabaseInstance, DatabaseInstanceStore, DatabaseManager, type DBE } from "./CDatabaseManager"
import db from "../lib/database";
import { writable, type Writable } from "svelte/store";
import DebugModule from "../lib/debug";
import { isArrayEqual } from "../lib/utils";

const debug = DebugModule.prefix("TodoManager.ts");

export class TodoError extends Error { }

export class TodoInstance extends DatabaseInstance {
    protected error(code: DBE, originalError: Error): Error { return originalError; }

    id: number
    description: string = "undefined todo"
    done: boolean = false
    tags: string[] = []

    constructor(payload: Partial<TodoInstance>) {
        super();

        this.id = payload.id || Date.now()
        this.description = payload.description || "corrupted todo"
        this.tags = payload.tags || []
        this.done = payload.done || false

        this.data = payload.data || ""
    }

    async getPrimaryKey(): Promise<string | number> { return this.id; }

    async getDatabaseData(): Promise<Object> {
        return {
            id: this.id,
            description: this.description,
            done: this.done,
            tags: this.tags,
        }
    }
}

export class TodoInstanceStore extends DatabaseInstanceStore<TodoInstance> {
    protected async updateInstanceData(data: Object): Promise<void> {
        this.object.description = data?.description || this.object.description
        this.object.done = data?.done || this.object.done
    }
}

export const todolist: Writable<TodoInstanceStore[]> = writable([]);

class CTodoManager extends DatabaseManager<TodoInstance, TodoInstanceStore> {

    protected error(code: DBE, originalerror: Error): Error { return originalerror; }
    private debug = debug.prefix("#CTagManager");

    private lastfilter;
    private lastkey;

    constructor() { super(db, "todos") };

    protected async buildStoreFromData(data: Partial<TodoInstance>): Promise<TodoInstanceStore> {
        return new TodoInstanceStore(
            new TodoInstance(data),
            () => () => { }
        );
    }
    protected async afterStoreDrop(store: TodoInstanceStore): Promise<void> { 
        todolist.update( lst => {
            const index = lst.indexOf(store);

            if(index > -1) 
                lst.splice(index, 1);

            return lst;
        })
    }

    async dropTag(pk: string): Promise<void> {
        throw Error("not implemented");
    }

    async updateList(tagfilter: string[] = [], key: CryptoKey = undefined) {

        const debug = this.debug.prefix(".updateList()", tagfilter, key);

        if(this.lastkey === key && isArrayEqual(tagfilter, this.lastfilter)) {
            debug.log("same credentials as before")
            return todolist.update( (lst) => lst );
        }
        else debug.log("new credentials", this.lastkey, this.lastfilter, tagfilter, key);

        this.lastkey = key;
        this.lastfilter = tagfilter;

        const newTodos = await Promise.all(
            (await(
                tagfilter.length
                    ? this.table.where("tags").anyOf(tagfilter).distinct().filter((todo) => {
                        const ret = tagfilter
                            .reduce((ok, e, i) => ok && todo.tags.indexOf(e) != -1, true)
                        return ret;
                    }).toArray()

                    : this.table.toArray()
            )).map((data) => this.buildStoreFromData(data))
        )

        debug.log("new TodoList will be", newTodos);

        if (key) {
            throw new Error("not implemented");
        }

        todolist.update( lst => {
            lst.splice(0, lst.length)
            return lst.concat(newTodos);
        } );
    }
}

export const TodoManager = new CTodoManager();
export default TodoManager;
