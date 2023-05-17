import type { Table } from "dexie";
import type { Subscriber, Unsubscriber } from "svelte/store";

export type PrimaryKey = string | number;

export class DataSet<T> {
    subscribe: (s: Subscriber) => Unsubscriber;
    set: (o: object) => any;
    data: T;
    refresh: () => any;
}

interface DataGroupConstructorOptions {
    idField: string,
}

export class DataGroup<T> {

    protected table: Table

    constructor( t: Table, opts: DataGroupConstructorOptions );

    findByPK(key: PrimaryKey): Promise<DataSet> 

    update(data: Partial<T>): Promise<DataSet<T>>

    drop(keyOrDataSet: PrimaryKey|DataSet<T>): Promise<any> 

    /**
     * En-/Decrypts all date in this group
     * @param {CryptoKey} newkey - Data will be encrypted with this key (if not given, data will just be decrypted)
     * @param {CryptoKey} oldkey - If data is already encrypted, then this is the key it was encrypted with
     * @returns {Promise<any>} resolves, once everything is done
     */
     encryptAll (newkey:CryptoKey|undefined, oldkey:CryptoKey|undefined): Promise<any> 

//==============================================================================
// Hooks
//==============================================================================
    /** Called before a dataset is deleted to give child classes a chance
    * to prevent unwanted deletions
    * @param {DataSet<T>} dataset - the dataset, that is going to be deleted 
    * @return {Promise<boolean>}
    */
    protected validateDrop(ds: DataSet<T>): Promise<boolean>;

    /** Called after a deletion took place, to allow child classes to clean up 
    * their dependend data
    * @param {DataSet<T>} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<any>}
    */
    protected afterDrop(ds: DataSet<T>): Promise<any>;

    /** Called after any data was added to the database
    * @param {object} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<any>}
    */
    protected afterUpdate(data: Partial<T>): Promise<any>;

    /** called if something with the Key for encrypting the data has changed
    * (To give childclasses a chance to clear their caches
    * @return {Promise.<any>}
    */
    protected onLockUnlock(key?: CryptoKey): Promise<any>;

//==============================================================================
// Abstract Methods
//==============================================================================
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
