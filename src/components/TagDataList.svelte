<script lang="ts">
    import { tagstore } from '../data/Tags';
</script>
<datalist id="available_tags">
    {#each $tagstore as tag}
        <option value={tag.value} /> 
    {/each}
</datalist> 