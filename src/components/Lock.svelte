<script context="module" lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import Tags from '../data/Tags';
    export const key: Writable<CryptoKey> = writable();
    export const hasPassword: Writable<boolean> = writable(localStorage.getItem("haslock") != undefined);
</script>

<script lang="ts">
    import Modal from '../lib/components/Modal.svelte'
    import { toast } from '../lib/components/Toast.svelte';
    import { password2CryptoKey } from '../lib/cryptography';

    let unlocked = localStorage.getItem("haslock") == undefined;
    let showUnlockDialog = false;

    let unlockdialog_message = "";

    let passwordInput = "";

    const toggleLock = () => {
        console.log("toggle Lock")
        if(unlocked) {
            if($hasPassword) {
                key.set(undefined);
                unlocked = false; 
            }
            else {
                unlockdialog_message = "Set a password";
                showUnlockDialog = true;
            }
        }
        else {
            toast("TODO clear password", "alert", 2)
            unlockdialog_message = "Enter your password";
            showUnlockDialog = true;
        }
    }

    const onUnLock = async () => {

        if(passwordInput.trim().length != passwordInput.length) {
            toast("password can't contain whitespaces at the start or end", "error", 4);
        }
        else if(!passwordInput.length) {
            toast("password is empty", "info", 2);
            unlocked = false;
            key.set(undefined);
            showUnlockDialog = false;
        }
        else {
            const newkey = await password2CryptoKey(passwordInput)
            if($hasPassword) {
                unlocked = true;
                key.set(newkey);
            }
            else {
                await Tags.encryptAll(newkey, $key);
                key.set(newkey);
                hasPassword.set(true);
                localStorage.setItem("haslock", "1");
                unlocked = false;
            }
            showUnlockDialog = false;
        }

    }


</script>

<a role="button" href={"#"} on:click|preventDefault={toggleLock} class="unlockbtn">
    <li class:fa-lock={!unlocked} class:fa-lock-open={unlocked} class="fa"></li>
</a>

{#if showUnlockDialog}
<Modal>
    <article>
        <form on:submit|preventDefault={onUnLock}>

            <h6> {unlockdialog_message}: </h6>

            <a href={"#"} on:click|preventDefault={() => showUnlockDialog = false} class="closebtn">
                <li class="fa fa-times" ></li>
            </a>

            <input type="password" bind:value={passwordInput} />

            <button type="submit">
                OK
            </button>

        </form>
    </article>
</Modal>
{/if}


<style lang="scss">
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

    .unlockbtn {
        white-space: nowrap;
        width: auto;
        float: left;
        margin-right: var(--spacing);
    }

</style>