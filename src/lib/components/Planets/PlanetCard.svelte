<script>
    import PlanetImage from './PlanetImage.svelte';
    import PlanetDetails from './PlanetDetails.svelte';
    import { travelToPlanet, depositMinerals, explorePlanet, startMining } from "$lib/stores/spaceship";
    import { mineMinerals } from "$lib/stores/resources";
    import { spaceship } from "$lib/stores/spaceship";
    import { markDialog } from "$lib/stores/dialogStore";
    export let planet; // Ensure planet is passed as a prop
</script>

<div class="planet-card relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:py-4 border border-blue-300 rounded-lg shadow-md">
    <!-- Lock Overlay for Locked Planets -->
    {#if !planet.unlocked}
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <span class="text-white text-lg font-bold">Locked</span>
        </div>
    {/if}

    <!-- Planet Image -->
    <PlanetImage {planet} />

    <!-- Planet Details and Actions -->
    <div class="flex flex-col space-y-4">
        <PlanetDetails {planet} />

        <!-- Badge for Unexplored Planets -->
        {#if !planet.explored && !planet.isHome}
            <span class="text-orange-500 font-bold text-sm">Unexplored</span>
        {/if}

        <!-- Actions -->
        {#if planet.unlocked}
            <div class="planet-actions flex flex-col gap-2">
                <!-- Home Planet Actions -->
                {#if planet.isHome}
                    <!-- Travel Button -->
                    <button
                        class="click-button"
                        on:click={() => travelToPlanet(planet)}
                        disabled={$spaceship.location === planet.name || $spaceship.traveling}
                    >
                        {#if $spaceship.location === planet.name}
                            At Home
                        {:else}
                            Travel Home
                        {/if}
                    </button>

                    <!-- Manual Mining Button -->
                    <button
                        class="click-button"
                        on:click={() => {
                            mineMinerals(1);
                            markDialog("manualMine"); // Mark the manual trigger dialog as completed
                        }}
                    >
                        Mine (Manual)
                    </button>

                    <!-- Deposit Minerals Button -->
                    <button
                        class="click-button"
                        on:click={depositMinerals}
                        disabled={$spaceship.location !== "Terra Prime" || $spaceship.currentLoad === 0}
                    >
                        Deposit Minerals
                    </button>
                {:else}
                    <!-- Travel Button -->
                    <button
                        class="click-button"
                        on:click={() => travelToPlanet(planet)}
                        disabled={$spaceship.location === planet.name || $spaceship.traveling}
                    >
                        {#if $spaceship.location === planet.name}
                            At Planet
                        {:else}
                            Travel
                        {/if}
                    </button>

                    <!-- Explore Button -->
                    <button
                        class="click-button"
                        on:click={() => explorePlanet(planet)}
                        disabled={
                            $spaceship.location !== planet.name || 
                            planet.explored || 
                            planet.resourcesAvailable > 0
                        }
                    >
                        Explore
                    </button>

                    <!-- Mine Button -->
                    <button
                        class="click-button"
                        on:click={() => startMining(planet)}
                        disabled={
                            $spaceship.location !== planet.name || 
                            planet.resourcesAvailable <= 0 || 
                            $spaceship.currentLoad >= $spaceship.capacity
                        }
                    >
                        Mine
                    </button>
                {/if}
            </div>
        {/if}
    </div>
</div>