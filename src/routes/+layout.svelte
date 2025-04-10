<script>
    import NavBar from '$lib/components/Navbar/Navbar.svelte';
    import MessageDisplay from '$lib/components/MessageDisplay.svelte';
    import DialogBox from '$lib/components/DialogBox.svelte';
    import { dialogState, triggerDialog, markDialog, startDialog } from '$lib/stores/dialogStore';
    import { onMount } from 'svelte';
    import '../app.css';

    export let children;

    // Subscribe to the dialogState store
    let currentDialogId, showDialog, dialogs;
    $: ({ currentDialogId, showDialog, dialogs } = $dialogState);

    // Example function to start a new dialog sequence
    const startNewMissionDialog = () => {
        startDialog("newMission"); // Will only start if "newMission" has show: true
    };

    onMount(() => {
        startDialog("welcome"); // Start the dialog sequence on load
    });
</script>

<NavBar />
<MessageDisplay />

<!-- Dialog Box -->
{#if showDialog}
    <DialogBox
        characterImage={dialogs.find((d) => d.id === currentDialogId)?.characterImage}
        dialogText={dialogs.find((d) => d.id === currentDialogId)?.dialogText}
        proceedMessage={dialogs.find((d) => d.id === currentDialogId)?.proceedMessage}
        manualTrigger={dialogs.find((d) => d.id === currentDialogId)?.manualTrigger}
        onComplete={triggerDialog}
    />
{/if}

<div class="content">
    {@render children()}
</div>

<style>
    .content {
        margin-top: 4rem; /* Adjust to avoid overlapping with the navbar */
    }
</style>
