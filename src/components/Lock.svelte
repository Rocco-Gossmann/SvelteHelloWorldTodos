<script context="module" lang="ts">
    import { writable, type Writable } from 'svelte/store';
    export const key: Writable<CryptoKey> = writable();
</script>

<script lang="ts">
    import Modal from '../lib/components/Modal.svelte'
    import { toast } from '../lib/components/Toast.svelte';
    import { password2CryptoKey } from '../lib/cryptography';

    let unlocked = false;
    let showUnlockDialog = false;

    let passwordInput = "";

    const toggleLock = () => {
        console.log("toggle Lock")
        if(!unlocked) {
            showUnlockDialog = true;
        }
        else {
            unlocked = false; 
        }
    }

    const onUnLock = async () => {
        if(passwordInput.trim().length != passwordInput.length) {
            toast("password can't contain whitespaces at the start or end", "error", 4);
        }
        else if(!passwordInput.length) {
            toast("password is empty", "info", 2);
            unlocked = false;
            showUnlockDialog = false;
            key.set(undefined);
        }
        else {
            key.set(await password2CryptoKey(passwordInput))
            unlocked = true;
            showUnlockDialog = false;
            toast("TODO: Implement Encryption", "error", 5);
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

            <h6> Enter your password: </h6>

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