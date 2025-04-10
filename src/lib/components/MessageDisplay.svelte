<script>
    import { messages } from '$lib/stores/messages';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    const FADE_DURATION = 2000; // Match the fade duration in the store
</script>

<div class="message-container">
    {#each $messages as { id, message, type } (id)}
        <div
            class="message {type.toLowerCase()}"
            out:fade={{ duration: FADE_DURATION }}
            animate:flip={{ duration: 500 }}
        >
            <strong>{type}:</strong> {message}
        </div>
    {/each}
</div>

<style>
    .message-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column; /* New messages appear at the bottom */
        gap: 0.5rem;
        z-index: 1000;
        padding: 0.5rem;
        pointer-events: none; /* Allow clicking through the container */
        align-items: flex-start; /* Prevent messages from stretching to the longest width */
    }

    .message {
        display: inline-block; /* Allow each message to size itself based on content */
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 0.75rem; /* Reduce padding for smaller messages */
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-size: 0.875rem; /* Decrease text size */
        line-height: 1.25rem; /* Adjust line height for readability */
        box-sizing: border-box;
        pointer-events: auto; /* Restore pointer events for the message itself */
        align-self: flex-end; /* Ensure each message sizes itself independently */
    }

    .message.error {
        border-left: 4px solid red;
    }

    .message.warning {
        border-left: 4px solid orange;
    }

    .message.information {
        border-left: 4px solid blue;
    }
</style>