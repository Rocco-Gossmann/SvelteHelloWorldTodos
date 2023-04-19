import type Dexie from '../assets/vendor/dexiejs/dexie'
import type { Table as DexieTable } from "../assets/vendor/dexiejs/dexie"

import type IJSONExportable from "./IJSONExportable"
import type IEncryptable from "./IEncryptable"
import { SvelteObjectStore } from '../lib/SvelteObjectStore'

type DatabasePrimaryKey = string | number;

export abstract class DatabaseInstance implements IEncryptable {

    data?: string;
    protected locked: boolean = false;

    abstract getPrimaryKey(): Promise<DatabasePrimaryKey>;

    abstract getDatabaseData(): Promise<Object>;

// Implement IEncryptable
    lock(key: CryptoKey): Promise<this> {
        throw new Error('Method not implemented.')
    }

    unlock(key: CryptoKey): Promise<this> {
        throw new Error('Method not implemented.')
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


export abstract class DatabaseManager<Instance extends DatabaseInstance, Store extends DatabaseInstanceStore<Instance>> implements IJSONExportable {

    protected table: DexieTable;

    protected abstract buildStoreFromData(data: Partial<Instance>, createNewIfNotExists: boolean): Promise<Store>;
    protected abstract afterStoreDrop(store: Store): Promise<void>;

    private instances: Map<DatabasePrimaryKey, Store> = new Map();

    constructor(db: Dexie, table: string) {
        this.table = db.table(table);
    }

    private loadInstanceData(pk: DatabasePrimaryKey): Promise<Partial<Instance>> {
        return this.table.get(pk);
    }

    async getInstanceByPK(pk: DatabasePrimaryKey): Promise<Store> {
        if (!this.instances.has(pk)) { 
            const instanceData = await this.loadInstanceData(pk);
            if (!instanceData) throw new Error(`no data for pk "${pk}" found`);

            const store = await this.buildStoreFromData(instanceData, false);
            this.instances.set(pk, store);

            return store;
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
                this.insert(store.object).then(instance => store)
            )
    }

    updateEntry(store: Store, instance: Instance, key?: CryptoKey): Promise<void> {
        const prom = key
            ? instance.lock(key)
            : Promise.resolve(instance)

        return prom.then(instance => this.insert(instance))
            .then(instance => instance.getDatabaseData())
            .then( data => store.updateData(data) )
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
    }

    private insert(instance: Instance):  Promise<Instance> { 
        return instance.getDatabaseData()
            .then( data => this.table.put(data) )
            .then( () => instance )
    }


// Implement IJSONExportable
    toJSONObject(): Promise<Object> {
        throw new Error("Method not implemented.")
    }
}

export default { DatabaseInstance, DatabaseManager }