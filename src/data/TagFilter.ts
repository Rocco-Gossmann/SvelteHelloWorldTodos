import { writable } from "svelte/store";

export const tagfilter = writable<string[]>([]);

export function addTag(tag: string) {
    tagfilter.update( lst => {
        if(lst.indexOf(tag) == -1) {
            lst.push(tag);
        }
        return lst;
    });
}

tagfilter.subscribe ( (lst) => {
    localStorage.setItem("tagfilter", JSON.stringify(lst));
})

export default { tagfilter, addTag }


/* TODO: Reimplement
    try {
        let filter = localStorage.getItem("tagfilter");
        let lastlist = [];
        if(filter) filter = JSON.parse(filter);
        if(isArray(filter)) {
            tagfilter.set(filter);
            const clearTags = [];
            (async () => {
                let tags = await Promise.all(
                    filter.map( 
                        (tag) => Tags.findByValue(tag)
                            .catch( err => {
                                console.warn(`tag '${tag}' does not exist`)
                                clearTags.push(tag);
                            })
                    )
                );

                clearTags.forEach((t) => tagfilter.update( list => lastlist = list.filter( t1 => t1 != t)))

                if(isArray(tags))
                    tags = tags.filter(t=>typeof(t) !== 'undefined');

            })()
        }

    }
    catch( err ) { /* NOP * / }
*/
