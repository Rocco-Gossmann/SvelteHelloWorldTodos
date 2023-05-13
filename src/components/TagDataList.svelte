<script lang="ts">
	import TagDataListOption from './TagDataListOption.svelte';

    import TagManager from '../data/TagManager';

</script>
<datalist id="available_tags">
    {#each $tagsstore as store}
        <TagDataListOption tagstore={store} />
    {/each}
</datalist> 
