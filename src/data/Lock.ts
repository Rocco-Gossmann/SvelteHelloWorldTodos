import { writable, type Writable } from 'svelte/store';

export const key: Writable<CryptoKey> = writable();
export const hasPassword: Writable<boolean> = writable(localStorage.getItem("haslock") != undefined);
