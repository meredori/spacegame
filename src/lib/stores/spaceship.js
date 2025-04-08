import { writable } from 'svelte/store';
import { addMessage, messageTypes } from './messages.js';
import { minerals } from './resources.js';
import { updatePlanet } from './planet.js'; // Import the updatePlanet function

// Create a writable store for the spaceship
export const spaceship = writable({
  name: "Explorer I",
  speed: 10, // Units per second
  capacity: 100, // Maximum minerals it can carry
  currentLoad: 0, // Current minerals onboard
  location: "Terra Prime", // Current planet
  traveling: false, // Whether the spaceship is in transit
  mining: false, // Whether the spaceship is mining
  explorationEfficiency: 1.5 // Multiplier for exploration
});

let miningInterval = null; // Store the mining interval ID

// Function to clear the mining loop
const clearMiningLoop = () => {
  if (miningInterval) {
    clearInterval(miningInterval);
    miningInterval = null;
    spaceship.update((current) => {
      current.mining = false;
      return current;
    });
    addMessage("Mining stopped.", messageTypes.information);
  }
};

// Function to calculate mining duration
export const calculateMiningDuration = (planet, spaceship) => {
  const miningRate = (spaceship.speed / 100) * planet.rate; // Mining rate based on spaceship speed and planet rate
  const timePerResource = 1000 / miningRate; // Time to mine one resource in milliseconds
  return Math.max(3000, timePerResource); // Ensure a minimum duration of 3 seconds
};

// Function to travel to a planet
export const travelToPlanet = (planet) => {
  spaceship.update((current) => {
    if (current.traveling) {
      addMessage("Spaceship is already traveling!", messageTypes.warning);
      return current;
    }

    // Stop mining when traveling
    clearMiningLoop();

    addMessage(`Traveling to ${planet.name}...`, messageTypes.information);
    current.traveling = true;

    // Simulate travel time based on distance and speed
    const travelTime = planet.distance / current.speed;

    setTimeout(() => {
      spaceship.update((updated) => {
        updated.location = planet.name;
        updated.traveling = false;
        addMessage(`Arrived at ${planet.name}!`, messageTypes.information);
        return updated;
      });
    }, travelTime * 1000);

    return current;
  });
};

// Function to start mining
export const startMining = (planet) => {
  spaceship.update((current) => {
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

    current.mining = true;

    const miningDuration = calculateMiningDuration(planet, current); // Use the updated function
    const resourcesPerInterval = 1; // Mine one resource per interval

    miningInterval = setInterval(() => {
      spaceship.update((updated) => {
        if (
          !updated.mining ||
          updated.currentLoad >= updated.capacity ||
          planet.resourcesAvailable <= 0 ||
          updated.location !== planet.name
        ) {
          clearMiningLoop();
          return updated;
        }

        const minedAmount = Math.min(resourcesPerInterval, planet.resourcesAvailable, updated.capacity - updated.currentLoad);

        if (minedAmount > 0) {
          updated.currentLoad += minedAmount;

          // Update the planet's resources using the planet store
          updatePlanet(planet.name, {
            resourcesAvailable: planet.resourcesAvailable - minedAmount,
          });

          addMessage(`Mined ${minedAmount} minerals from ${planet.name}.`, messageTypes.information);
        }

        return updated;
      });
    }, miningDuration);

    return current;
  });
};

// Function to stop mining
export const stopMining = () => {
  clearMiningLoop();
};

// Function to deposit minerals at home
export const depositMinerals = () => {
  spaceship.update((current) => {
    if (current.location !== "Terra Prime") {
      addMessage("Spaceship must be at home to deposit minerals!", messageTypes.warning);
      return current;
    }

    minerals.update((resource) => {
      resource.count += current.currentLoad;
      return resource;
    });

    addMessage(`Deposited ${current.currentLoad} minerals at home.`, messageTypes.information);
    current.currentLoad = 0; // Reset the spaceship's load
    return current;
  });
};

// Function to explore a planet
export const explorePlanet = (planet) => {
  spaceship.update((current) => {
    if (current.location !== planet.name) {
      addMessage("Spaceship must be at the planet to explore!", messageTypes.warning);
      return current;
    }

    if (planet.resourcesAvailable > 0) {
      addMessage("Planet still has resources. Exhaust resources before exploring again.", messageTypes.warning);
      return current;
    }

    const newMinerals = Math.floor(planet.baseMinerals * current.explorationEfficiency);

    // Update the planet's data using the planet store
    updatePlanet(planet.name, {
      resourcesAvailable: newMinerals,
      explored: true,
    });

    addMessage(`Explored ${planet.name} and found ${newMinerals} minerals!`, messageTypes.information);

    return current;
  });
};