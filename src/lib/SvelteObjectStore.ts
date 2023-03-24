import { writable, type StartStopNotifier, type Subscriber, type Unsubscriber, type Updater, type Writable } from "svelte/store";

export class SvelteObjectStore<T> implements Writable<T> {

    private _obj: T;

    subscribe: (run: Subscriber<T>, invalidate?: (value?: T) => void) => Unsubscriber
    parset:  (value: T) => void     

    constructor(tag: T, onStart: StartStopNotifier<T>) {
        const { subscribe, set } = writable<T>(tag, onStart);
        this.subscribe = subscribe;
        this.parset = set;

        this._obj = tag;
    }

    set(tag: T) {
        this._obj = tag;
        this.parset(tag);
    }

    get object() { return this._obj }
    set object(obj: T) { this.set(obj); }

    update(updater: Updater<T>) {
        const newval = updater(this._obj)
        this.set(newval)
    }

}