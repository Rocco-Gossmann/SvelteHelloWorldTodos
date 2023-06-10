<script>

    import TagManager from "../data/TagManager";
    import TodoManager from "../data/TodoManager";
    import utils, { Str2Buffer } from "../lib/utils";
    import { base64, synckey } from "../lib/cryptography";
    import { key, hasPassword } from '../data/Lock'


    async function onBtnClick() {

        const obj = {
            "tags":  await TagManager.toArray(),
            "todos": await TodoManager.toArray()
        };

        /** @type {Uint8Array} */
        const data = utils.Str2Buffer(JSON.stringify(obj));

        let payload = $hasPassword
            ? utils.BufferPrepend((await synckey.encrypt(data, $key)).toUint8Array(), Str2Buffer("ENC"))
            : utils.BufferPrepend(data                                              , Str2Buffer("RAW"))
        

        const url = `data:application/${$hasPassword ? "octet-stream" : "json"};base64,${base64.encrypt(payload)}`;

        let a = document.createElement("A")
        a.href = url;
        a.download = `export.${$hasPassword ? "bin" : "json"}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }

</script>


<a role="button" href={"#"} on:click|preventDefault={onBtnClick} class="" title="export JSON">
    <li  class="fas fa-file-export"></li>
</a>

<style>
    A { float: left; margin-right: var(--spacing);}
</style>
