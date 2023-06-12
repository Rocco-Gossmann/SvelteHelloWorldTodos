<script> //@ts-nocheck

    import { onDestroy, onMount } from "svelte";

    import Utils from "../lib/utils";
    import { toast } from "../lib/components/Toast.svelte";
    import Modal from "../lib/components/Modal.svelte";
    import { EncryptedData, password2CryptoKey, synckey } from "../lib/cryptography";
   

    /** @type {HTMLInputElement} */
    let showPasswordDialog = false;
    let resolvePassword = (cryptoKey) => {}
    let rejectPassword = (msg) => {}
    
    function askForPassword() {
        showPasswordDialog = true;
        return new Promise( (res, rej) => {
            resolvePassword = res;
            rejectPassword = rej;
        } )
    }

    function onPasswordInput(ev) {
        console.log("onPasswordInput", ev);
        /** @type {HTMLFormElement} */
        let frm = ev.target;

        let pass = frm.pwinput.value;
    
        
        password2CryptoKey(pass).then( p => resolvePassword(p) );

        showPasswordDialog = false;
    }



    /** @type {HTMLInputElement} */
    let fileInput;
    function onBtnClick() { fileInput.click(); }

   





    const fileHandler = new FileReader();
    function onFileChange(ev) { fileHandler.readAsArrayBuffer(ev.target.files[0]); }
    async function onFileRead(ev) {
        /** @type {ArrayBuffer} */
        const buff = ev?.target?.result;
        if(!buff || !(buff instanceof ArrayBuffer)) return;
    
        const fileType = Utils.Buffer2Str(buff.slice(0, 3));

        let obj = {};
        let str = "";
        switch(fileType) {
            case "ENC":
                try { 
                    let key = await askForPassword();
                    console.log(buff.slice(3));

                    const encData = EncryptedData.fromUint8Array(new Uint8Array(buff.slice(3)));
                    console.log(encData);

                    str = Utils.Buffer2Str(await synckey.decrypt(encData, key));
                }
                catch( err ) { 
                    console.error(err); 
                    toast("invalid password", "error", 4); 
                }

            case "RAW":
                if( fileType === 'RAW' ) str = Utils.Buffer2Str(buff.slice(3)); 

                try { obj = JSON.parse(str); }
                catch( err ) { 
                    console.error(err); 
                    toast("file corrupted", "error", 4); 
                }
                break;
                

            default: toast("not a valid file", "error", 4);
        }

        console.log(obj);
    }



    onMount( () => { 
        fileInput.addEventListener("change", onFileChange); 
        fileHandler.addEventListener("load", onFileRead);
    } )
    onDestroy( () => { 
        fileInput.removeEventListener("change", onFileChange); 
        fileHandler.removeEventListener("load", onFileRead);
    } )

</script>

<a role="button" href={"#"} on:click|preventDefault={onBtnClick} class="" title="import from File">
    <li  class="fas fa-file-import"></li>
</a>


{#if showPasswordDialog}
<Modal>
    <article>
        <form on:submit|preventDefault={onPasswordInput}>

            <h6> Enter the password of the File: </h6>

            <a href={"#"}   on:click|preventDefault={() => {
                                showPasswordDialog = false
                                rejectPassword("abort")
                            }} class="closebtn"
            >
                <li class="fa fa-times" ></li>
            </a>

            <input type="password" name="pwinput" />

            <button type="submit"> OK </button>

        </form>
    </article>
</Modal>
{/if}


<style lang="scss" >
    INPUT[type=file] { display: none }
    A { float: left; margin-right: var(--spacing);}

    FORM {
        display: grid;
        grid-gap: var(--spacing);
        grid-template-columns: 1fr 0fr;

        .closebtn {
            text-align: right;
        }
        
        INPUT {
            margin: 0px;
        }
    }
</style>
<input type="file" bind:this={fileInput} aria-hidden=true/>
