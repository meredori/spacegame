<script>
    import { messages } from '$lib/stores/messages';
</script>

{#if $messages.length > 0}
    <div class="text-center">
        {$messages[$messages.length - 1].type}: {$messages[$messages.length - 1].message}
    </div>
{/if}