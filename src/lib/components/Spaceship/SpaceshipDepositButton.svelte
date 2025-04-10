<script>
    import { depositMinerals } from "$lib/stores/spaceship";
    import { spaceship } from "$lib/stores/spaceship";
</script>

{#if $spaceship.location === "Terra Prime"}
    <div class="mt-4">
        <button
            class="click-button"
            on:click={depositMinerals}
            disabled={$spaceship.currentLoad === 0}
        >
            Deposit Minerals
        </button>
    </div>
{/if}