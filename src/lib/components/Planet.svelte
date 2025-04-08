<script>
    import { mineMinerals } from "$lib/stores/resources";
    import { explorePlanet } from "$lib/stores/spaceship";
    export let planet; // Ensure planet is passed as a prop
</script>

<div class="planet-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:py-4 border border-blue-300 rounded-lg shadow-md">
    <img
        class="planet-image mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0"
        src="https://picsum.photos/150?random={planet.rate}"
        alt="{planet.name}"
    />
    <div class="planet-details space-y-2 text-center sm:text-left">
        <div class="space-y-1">
            <p class="planet-name text-lg font-semibold">
                {planet.name}
                {#if planet.isHome}
                    <span class="text-sm text-green-400 font-bold">(Home)</span>
                {/if}
            </p>
            <p class="planet-description text-sm text-gray-400">{planet.description}</p>
            <p class="planet-distance font-medium">Distance: {planet.distance} gu</p>
            <p class="planet-rate font-medium">Mining Rate: {planet.rate}/s</p>
            {#if planet.explored}
                <p class="planet-resources font-medium">
                    Resources Available: {planet.resourcesAvailable}
                </p>
            {:else}
                <p class="planet-resources font-medium text-gray-500">
                    Resources Available: Unknown (Explore to find out)
                </p>
            {/if}
        </div>

        <!-- Only show manual buttons for the home planet -->
        {#if planet.isHome}
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
        {/if}
    </div>
</div>