/**
* Purpouse:
* - Handle alle Data in the IndexedDB  (via Dexie)
*   # Each instance handles one table 
*
* - datasets are provieded as stores
*   # stores are identfied by a single key (string or number)
*   # requested stores are cached.
*   # should the same key be requested multiple times, the cached version is returned
*   # updating the stores data always updates the data in the dataset
*
* - insertion of new datasets yeld a store of that dataset 
*/


import { writable } from "svelte/store";
import PromiseQueue from "./PromiseQueue";
import { key } from '../data/Lock.ts'

/** @typedef {string|number} PrimaryKey */

export class DataSet {

    _data = {};

    /**
    * @param {import("dexie").Table} table
    * @param {object} data
    */
    constructor(table, data) {
        this._data = data;
        const { set, subscribe, update } = writable(data);
        this.table = table;
        this.parset = set;
        this.subscribe = subscribe;
    }

    async set(data) { 
        await this.table.update(data)
        this.parset(data);
    }

    get data() { return this._data; }
    set data(dat) {
        this._data = dat
        this.set(this._data)
    }


    setDataNoWrite(data) {
        this._data = data;
        this.parset(data);
    }

    refresh() { this.set(this._data) }
}

/** 
* @typedef DataGroupConstructorOptions
* @type {object}
* @property {string} idField
*/

/** @class 
* @property {Map.<PrimaryKey, DataStore>} datasets
*/
export class DataGroup {

    /** Cached Dataset
    * @private 
    * @type {Map.<PrimaryKey, DataStore>}
    */
    dataset = new Map();

    /** @private */
    queue = new PromiseQueue();

    /** @private 
    * @type {import("dexie").Table} */
    table;

    /** @private */
    keyName = "";

    /** @private @type {CryptoKey} */
    lockkey = undefined;

    /** @private */
    autoIncrement = false;

    async validateDrop() { return true; }
    async afterDrop() { }
    async afterUpdate() { }
    async onLockUnlock() {}

    async lockDataSet(data) { return data; }
    async unlockDataSet(data) { return data; }

    /** Constructor
    * @param {import("dexie").Table} table
    * @param {DataGroupConstructorOptions} options
    */
    constructor(table, options) {
        this.table = table;

        if(options.idField)
            this.keyName = options.idField;

        if(options.autoIncrement) this.autoInrement = true;

        key.subscribe( (key) => {
            this.lockkey = key;
            this.dataset.clear();
            this.onLockUnlock(key);
        })
    }

    /** finds a dataset based on its primary key
    * @param {PrimaryKey} key
    * @param {CryptoKey} lockKey
    * @returns {Promise.<DataStore>}
    */
    async findByPK(key, lockKey) {
        const stack = (new Error("")).stack; 

        return await this.queue.add(
            this,
            (pk) => this.table.get(pk).then(async data => {

                if (!data) {
                    console.warn(`Request for pk '${pk}' on table '${this.table.name}' resulted in no data for call `, stack);
                    return undefined;
                }

                if (this.dataset.has(key)) {
                    let dat = this.dataset.get(key);
                    return this.dataset.get(key);
                }
                else {
                    if(this.lockkey)  {
                        
                        const ud = await this.unlockDataSet(data, this.lockkey);

                        const ds = new DataSet(this, ud);

                        this.dataset.set(pk, ds);

                        return ds;
                    }
                    else {
                        const ds = new DataSet(this, data);
                        this.dataset.set(pk, ds);
                        return Promise.resolve(ds);
                    }
                }
            }),
            key
        );
    }

    /** updates or creates a dataset
    * @param {PrimaryKey} key
    * @param {object} data
    * @returns {Promise.<DataSet>}
    */
    async update(data) {
        if (!data[this.keyName])
            throw new Error(`given data is missing field ${this.keyName}`);

        const key = data[this.keyName]

        /** @type {DataSet} */
        const existing = await this.findByPK(key);

        if (existing) {
            let obj = existing.data;
            for (let a of Object.keys(obj)) obj[a] = data[a];
            existing.setDataNoWrite(obj);
        }

        if (await this.table.put( this.lockkey
            ? await this.lockDataSet({...data}, this.lockkey)
            : data
        )) {
            this.dataset.delete(key);
            const ds = await this.findByPK(key);
            await this.afterUpdate(ds);

            return ds;
        }
        else throw new Error("failed to insert data");
    }

    /** removes an item from the datagroup
    * @param {PrimaryKey|DataSet} key
    */
    async drop(keyOrDataSet) {
        console.log(keyOrDataSet)
        if (!(keyOrDataSet instanceof DataSet))
            keyOrDataSet = await this.findByPK(keyOrDataSet);

        console.log(keyOrDataSet);
        const key = keyOrDataSet.data[this.keyName];

        if (await this.validateDrop(keyOrDataSet)) {
            await this.table.delete(key);
            await this.afterDrop(keyOrDataSet);
        }
    }


    /**
     * En-/Decrypts all date in this group
     *
     * @async
     * @param {CryptoKey} newkey - Data will be encrypted with this key (if not given, data will just be decrypted)
     * @param {CryptoKey} oldkey - If data is already encrypted, then this is the key it was encrypted with
     * @returns {Promise<any>} resolves, once everything is done
     */
    async encryptAll(newkey, oldkey) {

        this.table.db.transaction("rw", this.table, async () => {

            await this.table.each( async (ds) => {
                if(oldkey)
                    ds = await this.unlockDataSet(ds, oldkey);

                if(newkey)
                    ds = await this.lockDataSet(ds, newkey);
                
                this.table.put(ds);
            })
       
        })

    }

    toArray() {
        return this.table.toArray();  
    }
}

export default DataGroup
