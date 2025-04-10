import { writable } from 'svelte/store';
import { addMessage, messageTypes } from './messages.js';
import { minerals } from './resources.js';
import { updatePlanet, planets } from './planet.js';
import { calculateMiningDuration } from '$lib/utils/mining.js';
import { calculateDiscoveryChance } from '$lib/utils/exploration.js';
import { get } from 'svelte/store'; // Import the `get` function from Svelte

export const spaceship = writable({
  name: "Explorer I",
  speed: 10,
  capacity: 100,
  currentLoad: 0,
  location: "Terra Prime",
  traveling: false,
  mining: false,
  explorationEfficiency: 1.0, // Lowered from 1.5 to 1.0
  status: null, // Tracks the current status (e.g., "traveling", "mining", "searching")
  displayValue: null, // Tracks the display value for the current action
  progress: 0, // Tracks the progress percentage of the current action
  unlocked: false, // Initially locked
  currentlyPerforming(status) {
    return this.status === status;
  }
});

export const purchaseSpaceship = () => {
  minerals.update((current) => {
    if (current.count >= 20) {
      current.count -= 20;
      spaceship.update((ship) => {
        ship.unlocked = true;
        addMessage("Spaceship unlocked! Ready for exploration.", messageTypes.information);
        return ship;
      });
    } else {
      addMessage("Not enough minerals to unlock the spaceship!", messageTypes.warning);
    }
    return current;
  });
};

let actionInterval = null;

// Helper function to stop the current action
const stopCurrentAction = () => {
  clearInterval(actionInterval);
  spaceship.update((current) => {
    current.status = null;
    current.displayValue = null;
    current.progress = 0;
    current.mining = false;
    current.traveling = false;
    current.currentAction = null;
    return current;
  });
};

export const travelToPlanet = (planet) => {
  spaceship.update((current) => {
    if (!current.unlocked) {
      addMessage("Spaceship is locked! Purchase it to unlock.", messageTypes.warning);
      return current;
    }

    if (current.traveling) {
      addMessage("Spaceship is already traveling!", messageTypes.warning);
      return current;
    }

    // Stop any ongoing action before starting travel
    stopCurrentAction();

    addMessage(`Traveling to ${planet.name}...`, messageTypes.information);
    current.traveling = true;
    current.currentAction = `Traveling to ${planet.name}`;
    current.status = "traveling";
    current.displayValue = `Traveling to ${planet.name}`;
    current.progress = 0;

    // Access the current value of the planets store
    const currentPlanets = get(planets);
    const currentPlanet = currentPlanets.find((p) => p.name === current.location);

    if (!currentPlanet) {
      addMessage("Current planet not found!", messageTypes.error);
      stopCurrentAction();
      return current;
    }

    const distance = Math.abs(currentPlanet.distance - planet.distance);

    const travelTime = distance / current.speed; // Time in seconds
    const interval = 100; // Update progress every 100ms
    const increment = (100 / (travelTime * 1000)) * interval;

    actionInterval = setInterval(() => {
      spaceship.update((updated) => {
        updated.progress += increment;

        if (updated.progress >= 100) {
          clearInterval(actionInterval);
          updated.location = planet.name;
          updated.traveling = false;
          updated.currentAction = null;
          updated.status = null;
          updated.displayValue = null;
          updated.progress = 0;
          addMessage(`Arrived at ${planet.name}!`, messageTypes.information);
        }

        return updated;
      });
    }, interval);

    return current;
  });
};

export const startMining = (planet) => {
  spaceship.update((current) => {
    if (!current.unlocked) {
      addMessage("Spaceship is locked! Purchase it to unlock.", messageTypes.warning);
      return current;
    }

    if (current.location !== planet.name) {
      addMessage("Spaceship must be at the planet to mine!", messageTypes.warning);
      return current;
    }

    if (current.currentLoad >= current.capacity) {
      addMessage("Spaceship is at full capacity!", messageTypes.warning);
      return current;
    }

    if (planet.resourcesAvailable <= 0) {
      addMessage("No resources left on this planet!", messageTypes.warning);
      return current;
    }

    if (current.mining) {
      addMessage("Mining is already in progress!", messageTypes.warning);
      return current;
    }

    // Stop any ongoing action before starting mining
    stopCurrentAction();

    current.mining = true;
    current.currentAction = `Mining on ${planet.name}`;
    current.status = "mining";
    current.displayValue = `Mining on ${planet.name}`;
    current.progress = 0;

    const miningDuration = calculateMiningDuration(planet, current); // Duration to mine one resource
    const interval = 100; // Progress bar update interval in milliseconds
    const progressIncrement = (100 / miningDuration) * interval; // Progress increment per interval

    actionInterval = setInterval(() => {
      spaceship.update((updated) => {
        updated.progress += progressIncrement;

        // When progress reaches or exceeds 100%, mine one resource
        if (updated.progress >= 100) {
          updated.progress = 0; // Reset progress for the next resource

          // Calculate the amount to mine (1 resource or less if the planet has fewer resources)
          const minedAmount = Math.min(1, planet.resourcesAvailable, updated.capacity - updated.currentLoad);
          updated.currentLoad += minedAmount;

          // Update the planet's resources
          updatePlanet(planet.name, {
            resourcesAvailable: planet.resourcesAvailable - minedAmount
          });

          addMessage(`Mined ${minedAmount} minerals from ${planet.name}.`, messageTypes.information);

          // Stop mining if the spaceship is full or the planet has no resources left
          if (updated.currentLoad >= updated.capacity || planet.resourcesAvailable <= 0) {
            stopCurrentAction();

            if (updated.currentLoad >= updated.capacity) {
              addMessage("Spaceship is at full capacity!", messageTypes.warning);
            } else if (planet.resourcesAvailable <= 0) {
              addMessage("No resources left on this planet!", messageTypes.warning);
            }
          }
        }

        return updated;
      });
    }, interval);

    return current;
  });
};

export const depositMinerals = () => {
  spaceship.update((current) => {
    if (!current.unlocked) {
      addMessage("Spaceship is locked! Purchase it to unlock.", messageTypes.warning);
      return current;
    }

    if (current.location !== "Terra Prime") {
      addMessage("Spaceship must be at home to deposit minerals!", messageTypes.warning);
      return current;
    }

    // Stop any ongoing action before depositing minerals
    stopCurrentAction();

    minerals.update((resource) => {
      resource.count += current.currentLoad;
      return resource;
    });

    addMessage(`Deposited ${current.currentLoad} minerals at home.`, messageTypes.information);
    current.currentLoad = 0;
    return current;
  });
};

export const explorePlanet = (planet) => {
  spaceship.update((current) => {
    if (!current.unlocked) {
      addMessage("Spaceship is locked! Purchase it to unlock.", messageTypes.warning);
      return current;
    }

    if (current.location !== planet.name) {
      addMessage("Spaceship must be at the planet to explore!", messageTypes.warning);
      return current;
    }

    if (planet.explored) {
      addMessage(`${planet.name} is already explored!`, messageTypes.warning);
      return current;
    }

    // Stop any ongoing action before starting exploration
    stopCurrentAction();

    addMessage(`Exploring ${planet.name}...`, messageTypes.information);
    current.currentAction = `Exploring ${planet.name}`;
    current.status = "exploring";
    current.displayValue = `Exploring ${planet.name}`;
    current.progress = 0;

    const explorationTime = 5000 / current.explorationEfficiency; // Example exploration time calculation
    const interval = 100; // Update progress every 100ms
    const increment = (100 / explorationTime) * interval;

    actionInterval = setInterval(() => {
      spaceship.update((updated) => {
        updated.progress += increment;

        if (updated.progress >= 100) {
          clearInterval(actionInterval);
          updatePlanet(planet.name, { explored: true, resourcesAvailable: planet.baseMinerals });
          updated.currentAction = null;
          updated.status = null;
          updated.displayValue = null;
          updated.progress = 0;
          addMessage(`Exploration of ${planet.name} complete!`, messageTypes.information);
        }

        return updated;
      });
    }, interval);

    return current;
  });
};

export const discoverPlanet = () => {
  spaceship.update((current) => {
    if (!current.unlocked) {
      addMessage("Spaceship is locked! Purchase it to unlock.", messageTypes.warning);
      return current;
    }

    if (current.status) {
      addMessage("Spaceship is busy with another action!", messageTypes.warning);
      return current;
    }

    // Stop any ongoing action before starting discovery
    stopCurrentAction();

    addMessage("Searching for new planets...", messageTypes.information);
    current.status = "discovering";
    current.displayValue = "Scanning for planets (0.00% chance)";
    current.progress = 0;
    current.elapsedSearchTime = 0; // Track elapsed search time
    current.lastDisplayUpdate = 0; // Track last time the display was updated

    const searchInterval = 100; // Update every 100ms
    const displayUpdateInterval = 1000; // Update display every 1 second
    
    actionInterval = setInterval(() => {
      spaceship.update((updated) => {
        // Update the progress bar for visual feedback
        updated.progress = (updated.progress + 10) % 100; // Cycles between 0-100 for continuous motion
        
        // Increase the elapsed search time
        updated.elapsedSearchTime += searchInterval / 1000;
        
        // Get the list of undiscovered planets
        const planetsList = get(planets);
        
        // Sort planets by distance to get the closest undiscovered planet
        const undiscoveredPlanets = planetsList
          .filter(p => !p.unlocked && !p.isHome)
          .sort((a, b) => a.distance - b.distance);
        
        if (undiscoveredPlanets.length === 0) {
          // No more planets to discover
          addMessage("No more planets to discover!", messageTypes.information);
          stopCurrentAction();
          return updated;
        }
        
        // Get the closest undiscovered planet
        const closestPlanet = undiscoveredPlanets[0];
        
        // Calculate the current discovery chance, passing the planet distance as a parameter
        const currentChance = calculateDiscoveryChance(
          updated.speed, 
          updated.explorationEfficiency, 
          updated.elapsedSearchTime,
          closestPlanet.distance
        );
        
        // Only update the display text once per second
        const now = Math.floor(updated.elapsedSearchTime);
        if (now > updated.lastDisplayUpdate) {
          updated.displayValue = `Scanning for ${closestPlanet.name} (${(currentChance * 100).toFixed(2)}% chance)`;
          updated.lastDisplayUpdate = now;
        }
        
        // Only attempt discovery once per second to reduce calculations
        if (updated.elapsedSearchTime % 1 < searchInterval / 1000) {
          // Check if discovery happens this second
          if (Math.random() < currentChance) {
            // Unlock the planet
            updatePlanet(closestPlanet.name, { unlocked: true });
            
            // Send success message
            addMessage(`Discovered a new planet: ${closestPlanet.name}!`, messageTypes.information);
            
            // Stop the discovery process
            stopCurrentAction();
          }
        }
        
        return updated;
      });
    }, searchInterval);
    
    return current;
  });
};