import { writable } from 'svelte/store';

export const tagfilter = writable([]);

tagfilter.subscribe ( (lst) => {
    localStorage.setItem("tagfilter", JSON.stringify(lst));
})

let filter = localStorage.getItem("tagfilter");

try { filter = JSON.parse(filter); }
catch( err ) { filter = []; }

tagfilter.set(filter);

export default tagfilter;
