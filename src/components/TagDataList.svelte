<script lang="ts">
    import TagManager from '../data/TagManager';
    const tagstore = TagManager.values;

</script>
<datalist id="available_tags">
    {#each $tagstore as store}
        <option value={store} />
    {/each}
</datalist> 
