<script lang="ts">
	import TagDataListOption from './TagDataListOption.svelte';
    import TagManager from '../data/TagManager';

    const tagstore = TagManager.values;

    $: console.log("TagStore-Values: ", $tagstore);

</script>
<datalist id="available_tags">
    {#each $tagstore as store}
        <option value={store} />
    {/each}
</datalist> 
