<script>
  import { spaceship, travelToPlanet, startMining, explorePlanet, depositMinerals, stopMining, calculateMiningDuration } from "$lib/stores/spaceship";
  import { planets } from "$lib/stores/planet.js"; // Use the planets store

  let selectedPlanet = null; // Track the selected planet for the dropdown
  let progress = 0; // Track the progress of the current action
  let actionInterval = null; // Store the interval ID for clearing later
  let currentAction = null; // Track the current action (e.g., "Traveling", "Exploring", "Mining")
  let progressColor = "bg-blue-500"; // Default progress bar color

  // Function to start an action with a progress bar
  const startAction = (duration, onComplete, loop = false) => {
    progress = 0;

    // Clear any existing interval
    if (actionInterval) {
      clearInterval(actionInterval);
    }

    // Start a new interval for the action
    const intervalDuration = 100; // Update progress every 100ms
    const increment = (100 / duration) * (intervalDuration / 1000); // Calculate progress increment per interval

    actionInterval = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;

        if (loop) {
          progress = 0; // Reset progress for looping actions (e.g., mining)
        } else {
          clearInterval(actionInterval);
          actionInterval = null;
          onComplete();
        }
      }
    }, intervalDuration);
  };

  // Function to handle traveling
  const handleTravel = () => {
    // Stop any ongoing mining or other actions
    if (actionInterval) {
      clearInterval(actionInterval);
      actionInterval = null;
    }

    const travelTime = selectedPlanet.distance / $spaceship.speed;
    currentAction = "Traveling";
    progressColor = "bg-blue-500"; // Set color for traveling
    startAction(travelTime, () => {
      spaceship.update((current) => {
        current.traveling = false;
        current.location = selectedPlanet.name;
        return current;
      });
    });
    travelToPlanet(selectedPlanet);
  };

  // Function to handle exploring
  const handleExplore = () => {
    const exploreTime = 5 / $spaceship.explorationEfficiency; // Example: exploration takes 5 seconds divided by efficiency
    currentAction = "Exploring";
    progressColor = "bg-green-500"; // Set color for exploring
    startAction(exploreTime, () => {
      explorePlanet(selectedPlanet);
    });
  };

  // Function to handle mining
  const handleMine = () => {
    currentAction = "Mining";
    progressColor = "bg-yellow-500"; // Set color for mining

    // Calculate mining duration using the shared function
    const miningDuration = calculateMiningDuration(selectedPlanet, $spaceship);

    // Start the progress bar loop for mining
    startAction(miningDuration / 1000, () => {}, true); // Convert duration to seconds and enable looping

    // Delegate mining logic to spaceship.js
    startMining(selectedPlanet);
  };

  // Reactive statement to update the button label and action
  $: {
    if (!selectedPlanet) {
      buttonLabel = "Select a Planet";
      buttonAction = null;
    } else if ($spaceship.location !== selectedPlanet.name) {
      buttonLabel = "Travel";
      buttonAction = handleTravel;
    } else if (!selectedPlanet.explored || selectedPlanet.resourcesAvailable <= 0) {
      buttonLabel = "Explore";
      buttonAction = handleExplore;
    } else {
      buttonLabel = "Mine";
      buttonAction = handleMine;
    }
  }

  // Keep selectedPlanet in sync with $planets
  $: {
    if (selectedPlanet) {
      selectedPlanet = $planets.find((planet) => planet.name === selectedPlanet.name);
    }
  }

  let buttonLabel = "Select a Planet";
  let buttonAction = null;
</script>

<div class="spaceship-card p-4 border border-blue-300 rounded-lg shadow-md bg-slate-800 text-slate-200">
  <h2 class="text-lg font-bold mb-2">Spaceship: {$spaceship.name}</h2>
  <p><strong>Speed:</strong> {$spaceship.speed} units/s</p>
  <p><strong>Capacity:</strong> {$spaceship.capacity} minerals</p>
  <p><strong>Current Load:</strong> {$spaceship.currentLoad} minerals</p>
  <p><strong>Location:</strong> {$spaceship.location}</p>
  <p><strong>Status:</strong> {currentAction || "Idle"}</p>
  <p><strong>Exploration Efficiency:</strong> {$spaceship.explorationEfficiency}x</p>

  <!-- Progress Bar -->
  <div class="progress-bar bg-gray-700 rounded-full h-4 mt-4">
    <div
      class={`progress h-full rounded-full ${progressColor}`}
      style="width: {progress}%"
    ></div>
  </div>

  <div class="mt-4">
    <h3 class="text-md font-semibold">Select a Planet:</h3>
    <select
      class="dropdown bg-slate-700 text-slate-200 border border-blue-300 rounded-lg p-2 w-full"
      bind:value={selectedPlanet}
    >
      <option value="" disabled>Select a Planet</option>
      {#each $planets as planet} <!-- Use the reactive $planets store -->
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

  <!-- Deposit Minerals Button -->
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
</div>