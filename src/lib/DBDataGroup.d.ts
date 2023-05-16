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

    /** Called before a dataset is deleted to give child classes a chance
    * to prevent unwanted deletions
    * @param {DataSet<T>} dataset - the dataset, that is going to be deleted 
    * @return {Promise<boolean>}
    */
    protected validateDrop(ds: DataSet<T>): Promise<boolean>;

    /** Called after a deletion took place, to allow child classes to clean up 
    * their dependend data
    * @param {DataSet<T>} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<void>}
    */
    protected afterDrop(ds: DataSet<T>): Promise<any>;

    /** Called after any data was added to the database
    * @param {object} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<void>}
    */
    protected afterUpdate(data: Partial<T>): Promise<any>;

    /**
     * changes the given data into an decrypted state
     * @param {object} data - data data from the Database to decrypt
     * @param {CryptoKey} key - The key to unlock the data
     * @returns {Promise<object>} the unlocked data
     */
    protected abstract lockDataSet(data: object, key: CryptoKey): Promise<object>

    /**
     * changes the given data into a encrypted state
     * @async
     * @param {object} data - an object containing all data of the dataset to lock
     * @param {CryptoKey} key - The Key to do the locking with
     * @returns {Promise<object>} the dataset in a locked state
     */
    protected abstract unlockDataSet(data: object, key: CryptoKey): Promise<object>
};
