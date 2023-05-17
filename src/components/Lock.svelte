<script lang="ts">
    import Modal from '../lib/components/Modal.svelte'
    import { toast } from '../lib/components/Toast.svelte';
    import { password2CryptoKey } from '../lib/cryptography';
    import { key, hasPassword } from '../data/Lock';
    import TagManager from '../data/TagManager';
    import TodoManager from '../data/TodoManager';

    let unlocked = localStorage.getItem("haslock") == undefined;
    let showUnlockDialog = false;

    let unlockdialog_message = "";

    let passwordInput = "";

    const toggleLock = () => {
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
            passwordInput = "";
        }
        else {
            const newkey = await password2CryptoKey(passwordInput)
            if($hasPassword) {
                unlocked = true;
                key.set(newkey);
                passwordInput = "";
            }
            else {
                await TagManager.encryptAll(newkey, $key);
                await TodoManager.encryptAll(newkey, $key);
                hasPassword.set(true);
                localStorage.setItem("haslock", "1");
                key.set(undefined);
                unlocked = false;
                passwordInput = "";
            }
            showUnlockDialog = false;
        }

    }

    const deleteLock = async () => {
        if($key && confirm("this will remove the password protectedion from your todos. Continue?")) {
            await TagManager.encryptAll(undefined, $key);
            await TodoManager.encryptAll(undefined, $key);
            localStorage.removeItem("haslock");
            hasPassword.set(false);
            key.set(undefined);
            unlocked = true;
            passwordInput = "";
        }
    }


</script>

<a role="button" href={"#"} on:click|preventDefault={toggleLock} class="unlockbtn">
    <li class:fa-lock={!unlocked} class:fa-lock-open={unlocked} class="fa"></li>
</a>

{#if unlocked && $hasPassword}
<a role="button" href={"#"} on:click|preventDefault={deleteLock} class="unlockbtn">
    <li class="fa fa-shield-halved"></li>
</a>
{/if}


{#if showUnlockDialog}
<Modal>
    <article>
        <form on:submit|preventDefault={onUnLock}>

            <h6> {unlockdialog_message}: </h6>

            <a href={"#"} on:click|preventDefault={() => showUnlockDialog = false} class="closebtn">
                <li class="fa fa-times" ></li>
            </a>

            <input type="password" bind:value={passwordInput} />

            <button type="submit"> OK </button>

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
