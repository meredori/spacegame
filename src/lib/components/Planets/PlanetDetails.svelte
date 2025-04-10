<script>
    export let planet; // Ensure planet is passed as a prop
</script>

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
</div>