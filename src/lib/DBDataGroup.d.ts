import type { Table } from "dexie";
import type { Subscriber, Unsubscriber } from "svelte/store";

export type PrimaryKey = string | number;

export class DataSet<T> {
    subscribe: (s: Subscriber) => Unsubscriber;
    set: (o: object) => void;
    data: T;
    refresh: () => void;
}

interface DataGroupConstructorOptions {
    idField: string,
}

export class DataGroup<T> {

    protected table: Table

    constructor( t: Table, opts: DataGroupConstructorOptions );

    findByPK: (key: PrimaryKey) => Promise<DataSet> 

    update: (data: Partial<T>) => Promise<DataSet<T>>

    drop: (keyOrDataSet: PrimaryKey|DataSet<T>) => Promise<void> 

    protected validateDrop(ds: DataSet<T>): Promise<boolean>;

    protected afterDrop(ds: DataSet<T>): Promise<any>;

    protected afterUpdate(data: Partial<T>): Promise<any>;
};
