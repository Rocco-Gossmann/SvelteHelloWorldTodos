import type { Table } from "dexie";
import type { Subscriber, Unsubscriber } from "svelte/store";

export type PrimaryKey = string | number;

export class DataSet {
    subscribe: (s: Subscriber) => Unsubscriber;
    set: (o: object) => void;
}

export class DataGroup {

    constructor( t: Table );

    findByPK: (key: PrimaryKey) => Promise<DataSet> 
};