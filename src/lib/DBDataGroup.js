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

    /** @private */
    autoIncrement = false;


    /** Called before a dataset is deleted to give child classes a chance
    * to prevent unwanted deletions
    * @protected
    * @param {DataSet} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<boolean>}
    */
    async validateDrop(dataset) { return true; }


    /** Called after a deletion took place, to allow child classes to clean up 
    * their dependend data
    * @protected
    * @param {DataSet} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<void>}
    */
    async afterDrop(dataset) { }

    /** Called after any data was added to the database
    * @protected
    * @param {object} dataset - the dataset, that is going to be deleted 
    * @return {Promise.<void>}
    */
    async afterUpdate(data) { }


    /** Constructor
    * @param {import("dexie").Table} table
    * @param {DataGroupConstructorOptions} options
    */
    constructor(table, options) {
        this.table = table;

        if(options.idField)
            this.keyName = options.idField;

        if(options.autoIncrement) this.autoInrement = true;
    }

    /** finds a dataset based on its primary key
    * @param {PrimaryKey} key
    * @returns {Promise.<DataStore>}
    */
    async findByPK(key) {
        return await this.queue.add(
            this,
            (pk) => this.table.get(pk).then(data => {

                if (!data) return Promise.resolve(undefined);

                if (this.dataset.has(key)) {
                    return this.dataset.get(key);
                }
                else {
                    const ds = new DataSet(this.table, data);
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
        if (!data[this.keyName])
            throw new Error(`given data is missing field ${this.keyName}`);

        const key = data[this.keyName]

        /** @type {DataSet} */
        const existing = await this.findByPK(key);

        if (existing) {
            let obj = existing.data;
            for (let a of existing) obj[a] = data[a];
            existing.data = obj;
            await this.afterUpdate(data);
            return existing;
        }
        else {
            if (await this.table.put(data)) {
                await this.afterUpdate(data);
                return await this.findByPK(key);
            }
            else throw new Error("failed to insert data");
        }
    }

    /** removes an item from the datagroup
    * @param {PrimaryKey|DataSet} key
    */
    async drop(keyOrDataSet) {

        if (!(keyOrDataSet instanceof DataSet))
            keyOrDataSet = this.findByPK(keyOrDataSet);

        const key = keyOrDataSet.data[this.keyName];

        if (await this.validateDrop(keyOrDataSet)) {
            await this.table.delete(key);
            await this.afterDrop(keyOrDataSet);
        }
    }
}

export default DataGroup
