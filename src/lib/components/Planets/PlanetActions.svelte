<script>
    import { mineMinerals } from "$lib/stores/resources";
    import { explorePlanet } from "$lib/stores/spaceship";
    export let planet; // Ensure planet is passed as a prop
</script>

<div class="planet-actions">
    <button
        class="click-button"
        onclick={() => {
            if (!planet.explored || planet.resourcesAvailable <= 0) {
                explorePlanet(planet);
            } else {
                mineMinerals(planet.rate);
            }
        }}
        disabled={planet.explored && planet.resourcesAvailable <= 0}
        title={
            !planet.explored
                ? "Explore this planet to uncover resources!"
                : planet.resourcesAvailable <= 0
                ? "No resources left! Explore again to find more."
                : ""
        }
    >
        {#if !planet.explored}
            Explore
        {:else if planet.resourcesAvailable <= 0}
            Re-Explore
        {:else}
            Mine
        {/if}
    </button>
</div>