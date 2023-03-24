<script lang="ts">
    import type { TagStore } from "../data/Tags";

    export let tagstore: TagStore;
</script>

<option value={$tagstore.value} />