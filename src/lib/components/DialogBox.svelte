<script>
    import { onMount } from "svelte";

    export let characterImage = ""; // URL of the character's image
    export let dialogText = ""; // Full dialog text
    export let onComplete = () => {}; // Callback when dialog finishes typing
    export let proceedMessage = "(Click to proceed)"; // Custom message for proceeding
    export let manualTrigger = false; // If true, disables click-to-proceed

    let displayedText = ""; // Text currently displayed on the screen
    let typingInterval = null;
    let isTypingComplete = false; // Tracks if typing is complete

    const TYPING_SPEED = 20; // Speed of typing in milliseconds per character

    // Function to start typing the dialog text
    const startTyping = () => {
        let index = 0;
        displayedText = "";
        isTypingComplete = false;

        typingInterval = setInterval(() => {
            if (index < dialogText.length) {
                displayedText += dialogText[index];
                index++;
            } else {
                clearInterval(typingInterval);
                isTypingComplete = true; // Mark typing as complete
            }
        }, TYPING_SPEED);
    };

    // Start typing when the component is mounted or dialogText changes
    $: if (dialogText) {
        clearInterval(typingInterval);
        startTyping();
    }

    // Cleanup interval when the component is destroyed
    onMount(() => {
        return () => clearInterval(typingInterval);
    });

    // Handle clicking to proceed
    const handleProceed = () => {
        if (manualTrigger) return; // Disable click-to-proceed if manualTrigger is true

        if (!isTypingComplete) {
            // If typing is not complete, finish typing immediately
            clearInterval(typingInterval);
            displayedText = dialogText;
            isTypingComplete = true;
        } else {
            // If typing is complete, proceed to the next dialog
            onComplete();
        }
    };
</script>

<div
    class="dialog-box flex items-center gap-4 p-4 border border-blue-300 rounded-lg shadow-md bg-slate-800 text-slate-200"
    on:click={handleProceed}
>
    <!-- Character Image -->
    {#if characterImage}
        <img src={characterImage} alt="Character" class="character-image h-24 w-24 rounded-full border border-blue-300" />
    {/if}

    <!-- Dialog Text -->
    <div class="dialog-text text-lg font-medium">
        {displayedText}
        {#if isTypingComplete && !manualTrigger}
            <span class="proceed-text text-sm text-gray-400 block mt-2">{proceedMessage}</span>
        {/if}
    </div>
</div>

<style>
    .dialog-box {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        right: 2rem;
        z-index: 1000;
        cursor: pointer; /* Indicate that the dialog box is clickable */
    }

    .character-image {
        flex-shrink: 0;
    }

    .dialog-text {
        white-space: pre-wrap; /* Preserve line breaks in the dialog text */
    }

    .proceed-text {
        font-style: italic;
    }
</style>