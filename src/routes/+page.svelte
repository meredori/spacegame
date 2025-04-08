<script>
    import Scoreboard from "$lib/components/Scoreboard.svelte";
    import Spaceship from "$lib/components/Spaceship.svelte";
    import Planet from "$lib/components/Planet.svelte";
    import { planets } from "$lib/stores/planet.js"; // Use the planets store
</script>

<div class="page-layout flex flex-col lg:flex-row gap-6 p-6">
    <!-- Scoreboard Section -->
    <div class="scoreboard-container w-full lg:w-1/4">
        <Scoreboard />
        <Spaceship />
    </div>

    <!-- Planets Section -->
    <div class="planets-container w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $planets as planet (planet.name)} <!-- Use the reactive $planets store -->
            <Planet planet={planet} />
        {/each}
    </div>
</div>

