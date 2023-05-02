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
*    
*/


import { writable } from "svelte/store";
import PromiseQueue from "./PromiseQueue";
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

    set(data) {
        this.table.put(data)
        this.parset(data)
    }

    get data() { return this._data; }
    set data(dat) { 
        this._data = dat 
        this.set(this._data)
    }

}


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

    /** Constructor
    * @param {import("dexie").Table} table
    * @param {string} keyName
    */
    constructor(table, keyName) {
        this.table = table;
        this.keyName = keyName;
    }

    /** finds a dataset based on its primary key
    * @param {PrimaryKey} key
    * @returns Promise.<DataStore>
    */
    async findByPK(key) {
        return await this.queue.add(
            this,
            (pk) => this.table.get(pk).then(data => {

                if(!data) return Promise.resolve(undefined);

                if (this.dataset.has(key)) {
                    console.log("found in cache", key, this.dataset.get(key), this.dataset);
                    return this.dataset.get(key);
                }
                else {
                    const ds = new DataSet(this.table, data);
                    console.log("load into cache", ds);
                    this.dataset.set(pk, ds);
                    return Promise.resolve(ds);
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

        if(!data[this.keyName]) 
            throw new Error(`given data is missing field ${this.keyName}`);

        const key = data[this.keyName]

        /** @type {DataSet} */
        const existing = await this.findByPK(key);

        if(existing) {
            let obj = existing.data;
            for(let a of key) obj[a] = data[a];
            existing.data = obj;
            return existing;
        }
        else {
            if(await this.table.put(data)) 
                return await this.findByPK(key);    
            else throw new Error("failed to insert data");
        }

    }
}

export default DataGroup
