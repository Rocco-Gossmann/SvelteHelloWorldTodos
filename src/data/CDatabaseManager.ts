import type Dexie from '../assets/vendor/dexiejs/dexie'
import type { Table as DexieTable } from "../assets/vendor/dexiejs/dexie"

import type IJSONExportable from "./IJSONExportable"
import type IEncryptable from "./IEncryptable"
import { SvelteObjectStore } from '../lib/SvelteObjectStore'

import DebugModule from '../lib/debug'
import type { Subscriber } from 'svelte/store'

const debug = DebugModule.prefix("CDatabaseManager.ts")

type DatabasePrimaryKey = string | number;

export abstract class DatabaseInstance implements IEncryptable {

    data?: string;
    protected locked: boolean = false;

    abstract getPrimaryKey(): Promise<DatabasePrimaryKey>;
    abstract getDatabaseData(): Promise<Object>;
    protected abstract error(code: DBE, originalError: Error): Error

// Implement IEncryptable
    lock(key: CryptoKey): Promise<this> {
        throw this.error("not_implemented", new Error('Method not implemented.'))
    }

    unlock(key: CryptoKey): Promise<this> {
        throw this.error("not_implemented", new Error('Method not implemented.'))
    }

    isLocked(): boolean { return this.locked; }
}

export abstract class DatabaseInstanceStore<Instance extends DatabaseInstance> extends SvelteObjectStore<Instance> {
    protected abstract updateInstanceData(data: Object): Promise<void>

    updateData(data: Object) {
        this.updateInstanceData(data);
        this.set(this.object);
    }
}

export type DBE = "none" | "no_data_for_pk" | "not_implemented" 

export abstract class DatabaseManager<Instance extends DatabaseInstance, Store extends DatabaseInstanceStore<Instance>> implements IJSONExportable {

    protected static readonly ERROR_NO_DATA_FOR_PK = 1;

    protected table: DexieTable;

    protected abstract buildStoreFromData(data: Partial<Instance>, createNewIfNotExists: boolean): Promise<Store>;
    protected abstract afterStoreDrop(store: Store): Promise<void>;

    protected abstract error(code: DBE, originalerror: Error): Error

    private instances: Map<DatabasePrimaryKey, Store> = new Map();

    private changeListeners: Set<()=>void> = new Set();

    constructor(db: Dexie, table: string) {
        this.table = db.table(table);
    }

    private loadInstanceData(pk: DatabasePrimaryKey): Promise<Partial<Instance>> {
        return this.table.get(pk);
    }

    registerChangeListener( listener: ()=>void ): () => void {
        return () => this.changeListeners.delete(listener);
    }

    signalChange() {
        this.changeListeners.forEach( fnc => fnc() ) 
    }

    async getInstanceByPK(pk: DatabasePrimaryKey): Promise<Store> {
        const deb = debug.prefix("#DatabaseManager.getInstanceByPK()", pk);
        if (!this.instances.has(pk)) { 
            deb.log("not loaded yet")
            const instanceData = await this.loadInstanceData(pk);

            deb.log("instance data", instanceData)
            if (!instanceData) throw this.error("no_data_for_pk", new Error(`no data for pk "${pk}" found`));

            const store = await this.buildStoreFromData(instanceData, false);
            deb.log("built store", store)

            this.instances.set(pk, store);
        }

        return this.instances.get(pk);
    }

    createNewEntry(data: Partial<Instance>, key?: CryptoKey): Promise<Store> {
        return this.buildStoreFromData(data, true)
            .then(store => key
                ? store.object.lock(key).then(() => store)
                : store
            )
            .then(store =>
                this.insert(store.object).then(instance => {
                    this.signalChange();
                    return store
                })
            )
    }

    updateEntry(store: Store, instance: Instance, key?: CryptoKey): Promise<void> {
        const prom = key
            ? instance.lock(key)
            : Promise.resolve(instance)

        return prom.then(instance => this.insert(instance))
            .then(instance => instance.getDatabaseData())
            .then( data => store.updateData(data) )
            .then( () => this.signalChange() )
    }

    dropEntry(store: Store): Promise<void> {
        const context: {
            pk?: DatabasePrimaryKey
        } = {}

        return store.object.getPrimaryKey()
            .then(pk => {
                context.pk = pk
                this.table.delete(pk)
            })
            .then(() => { this.instances.delete(context.pk) })
            .then(() => this.afterStoreDrop(store))
            .then(() => this.signalChange())
    }

    private insert(instance: Instance):  Promise<Instance> { 
        return instance.getDatabaseData()
            .then( data => this.table.put(data) )
            .then( () => {
                this.signalChange()
                return instance
            } )
    }

    public async encryptAll(newKey: CryptoKey, oldKey?: CryptoKey): Promise<void> {
        throw this.error("not_implemented", new Error("encryptAll not implemented"));
    }


// Implement IJSONExportable
    toJSONObject(): Promise<Object> {
        throw this.error("not_implemented", new Error("Method not implemented."));
    }
}

export default { DatabaseInstance, DatabaseManager }
