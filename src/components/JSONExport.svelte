<script>
    import TagManager from "../data/TagManager";
    import TodoManager from "../data/TodoManager";
    import utils from "../lib/utils";
    import { base64 } from "../lib/cryptography";

    async function onBtnClick(ev) {

        const obj = {
            "tags":  await TagManager.toArray(),
            "todos": await TodoManager.toArray()
        };

        const payload = base64.encrypt(utils.Str2Buffer(JSON.stringify(obj)));

        const url = `data:application/json;base64,${payload}`;


        let a = document.createElement("A")
        a.href = url;
        a.download = "export.json";

        document.body.appendChild(a);
        a.click();

    }

</script>


<a role="button" href={"#"} on:click|preventDefault={onBtnClick} class="" title="export JSON">
    <li  class="fas fa-file-export"></li>
</a>

<style>
    A { float: left; margin-right: var(--spacing);}
</style>
