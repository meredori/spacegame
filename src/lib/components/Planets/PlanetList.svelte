<script>
    import PlanetCard from './PlanetCard.svelte';
    import { planets } from '$lib/stores/planet.js';
</script>

<div class="planet-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each $planets as planet}
        <PlanetCard {planet} />
    {/each}
</div>