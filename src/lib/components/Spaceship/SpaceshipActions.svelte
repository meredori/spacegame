<script>
    import { planets } from "$lib/stores/planet.js";
    export let selectedPlanet;
    export let buttonLabel;
    export let buttonAction;
</script>

<div class="spaceship-actions mt-4">
    <h3 class="text-md font-semibold">Select a Planet:</h3>
    <select
        class="dropdown bg-slate-700 text-slate-200 border border-blue-300 rounded-lg p-2 w-full"
        bind:value={selectedPlanet}
    >
        <option value="" disabled>Select a Planet</option>
        {#each $planets as planet}
            <option value={planet}>{planet.name} ({planet.distance} gu)</option>
        {/each}
    </select>
    <button
        class="click-button mt-2"
        on:click={buttonAction}
        disabled={!buttonAction}
    >
        {buttonLabel}
    </button>
</div>