<script lang="ts">
	import TagDataListOption from './TagDataListOption.svelte';
    import { tagsstore } from '../data/Tags';

</script>
<datalist id="available_tags">
    {#each $tagsstore as store}
        <TagDataListOption tagstore={store} />
    {/each}
</datalist> 