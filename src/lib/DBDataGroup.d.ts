import type { Table } from "dexie";
import type { Subscriber, Unsubscriber } from "svelte/store";

export type PrimaryKey = string | number;

export class DataSet<T> {
    subscribe: (s: Subscriber) => Unsubscriber;
    set: (o: object) => void;
    data: T;
}

export class DataGroup {

    constructor( t: Table, keyName: string );

    findByPK: (key: PrimaryKey) => Promise<DataSet> 

    update: (data: object) => Promise<DataSet>

    drop: (keyOrDataSet: PrimaryKey|DataSet) => Promise<void> 
};
