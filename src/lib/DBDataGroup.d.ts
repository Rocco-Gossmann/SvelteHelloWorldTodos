import type { Table } from "dexie";
import type { Subscriber, Unsubscriber } from "svelte/store";

export type PrimaryKey = string | number;

export class DataSet<T> {
    subscribe: (s: Subscriber) => Unsubscriber;
    set: (o: object) => void;
    data: T;
}

interface DataGroupConstructorOptions {
    idField: string,
}

export class DataGroup {
    constructor( t: Table, opts: DataGroupConstructorOptions );

    findByPK: (key: PrimaryKey) => Promise<DataSet> 

    update: (data: object) => Promise<DataSet>

    drop: (keyOrDataSet: PrimaryKey|DataSet) => Promise<void> 

    protected validateDrop(ds: DataSet): Promise<boolean>;

    protected afterDrop(ds: DataSet): Promise<any>;
};
