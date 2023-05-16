import { writable } from "svelte/store";


/** @type {import("svelte/store").Writable<string[]>} */
export const tagfilter = writable([]);

/**
 * adds a Tag to filter
 * @param {string} tag - the key of the tag to add
 */
export function addTag(tag) {
    tagfilter.update( lst => {
        if(lst.indexOf(tag) == -1) {
            lst.push(tag);
        }
        return lst;
    });
}

try {
    let filter = localStorage.getItem("tagfilter");
    if(filter) filter = JSON.parse(filter);
    if(filter instanceof Array) tagfilter.set(filter);
}
catch( err ) { 
    console.warn("failed to load taglist from localStorage"); 
    localStorage.removeItem("tagfilter"); 
}

tagfilter.subscribe ( lst => localStorage.setItem("tagfilter", JSON.stringify(lst)))

export default { tagfilter, addTag }

