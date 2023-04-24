<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import db from '../lib/database';
    import DebugModule from '../lib/debug';
    
    import { key } from '../data/Lock';
    import TagManager from '../data/TagManager';

    import cryptography from '../lib/cryptography';

    const debug = DebugModule.prefix("TagDataList.svelte");

    let taglist = [];
    $: debug.log("taglist changed", taglist);

    async function onTagListChanged() {
        const deb = debug.prefix("#onTagListChange()", "start")
        taglist.splice(0, taglist.length);

        const tags = await db.table("tags").toArray();
        deb.log("got", tags.length,  "tag(s) from db");

        deb.log("Encryption Key is: ", $key);

        const proms = [];
        if($key) tags.forEach( (tag) => {
            throw new Error("Todo Implement decryption of Tag");
        } )
        else tags.forEach( (tag) => taglist.push(tag.value) )

        await Promise.all(proms)
        deb.log("new taglist = ", taglist)
        taglist = taglist;
    }

    let unsub = () => {}
    $: debug.log("unsub changed", unsub);

    onMount( () => {
        unsub = TagManager.registerChangeListener(onTagListChanged);
        onTagListChanged();
    } )
    onDestroy( () => unsub() )

</script>
<datalist id="available_tags">
    {#each taglist as tag}
        <option value={tag} />
    {/each}
</datalist> 
