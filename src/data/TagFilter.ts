import { writable } from "svelte/store";
import { isArray } from "../lib/utils";

export const tagfilter = writable<string[]>([]);

export function addTag(tag: string) {
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
    if(isArray(filter)) tagfilter.set(filter);
}
catch( err ) { 
    console.warn("failed to load taglist from localStorage"); 
    localStorage.removeItem("tagfilter"); 
}

tagfilter.subscribe ( lst => localStorage.setItem("tagfilter", JSON.stringify(lst)))

export default { tagfilter, addTag }

