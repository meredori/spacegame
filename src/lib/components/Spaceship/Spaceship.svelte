<script>
    import SpaceshipDetails from "./SpaceshipDetails.svelte";
    import SpaceshipProgressBar from "./SpaceshipProgressBar.svelte";
    import { spaceship, purchaseSpaceship, discoverPlanet } from "$lib/stores/spaceship";
    import { markDialog } from "$lib/stores/dialogStore";
    import { planets } from "$lib/stores/planet.js";

    // Reactive color based on the current status
    $: progressColor = $spaceship.status === "traveling"
        ? "bg-blue-500"
        : $spaceship.status === "mining"
        ? "bg-yellow-500"
        : $spaceship.status === "exploring"
        ? "bg-green-500"
        : $spaceship.status === "discovering"
        ? "bg-purple-500"
        : "bg-gray-500"; // Default color for idle
        
    // Get the next undiscovered planet name for display during discovery
    $: nextPlanetTarget = $planets.find(p => !p.unlocked && !p.isHome)?.name || "Unknown";
</script>

<div class="spaceship-card p-4 border border-blue-300 rounded-lg shadow-md bg-slate-800 text-slate-200">
    {#if !$spaceship.unlocked}
        <button
            class="click-button"
            on:click={() => {
                purchaseSpaceship();
                markDialog("unlockSpaceship"); // Trigger the unlockSpaceship dialog
            }}
        >
            Purchase Spaceship (20 Minerals)
        </button>
    {:else}
        <SpaceshipDetails />
        <SpaceshipProgressBar color={progressColor} />
        
        {#if $spaceship.status === "discovering"}
            <p class="text-sm mt-2">Searching for: {nextPlanetTarget}</p>
        {/if}
        
        <button
            class="click-button mt-4"
            on:click={() => {
                discoverPlanet();
                markDialog("discoverPlanet"); // Trigger the discoverPlanet dialog
            }}
            disabled={$spaceship.status === "discovering"}
        >
            {$spaceship.status === "discovering" ? "Discovering..." : "Discover"}
        </button>
    {/if}
</div>