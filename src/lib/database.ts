import Dexie from "dexie"
import type { Table } from "dexie";

interface Tag {
    key: string
    value: string
    color: string
    version: number
    data?: string
};

interface Todo {
    id: number
    description: string
    tags: string[]
    data?: string
}


export class MySubClassedDexie extends Dexie {
    
  tags!: Table<Tag>; 
  todos!: Table<Todo>;

  constructor() {
    super('helloworldtodos');

    this.version(2).stores({
        tags: "&key",
        todos: "++id,*tags",
    });
  }
}

export const db = new MySubClassedDexie();
export default db;
