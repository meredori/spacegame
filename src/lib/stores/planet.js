import { writable } from 'svelte/store';
import { addMessage, messageTypes } from './messages.js'; // Import addMessage and messageTypes
import { spaceship } from './spaceship.js'; // Import spaceship store
import { get } from 'svelte/store'; // Import get function to access store values

// Helper function to create a planet
const createPlanet = ({
  name,
  isHome = false,
  description,
  distance,
  rate,
  baseMinerals,
  resourcesAvailable = 0,
  explored = false,
  unlocked = false,
}) => ({
  name,
  isHome,
  description,
  distance,
  rate,
  baseMinerals,
  resourcesAvailable,
  explored,
  unlocked,
});

// Initialize the planet store with default data
export const planets = writable([
  // Home Planet
  createPlanet({
    name: "Terra Prime",
    isHome: true,
    description: "The home planet of humanity, a beacon of civilization.",
    distance: 0,
    rate: 1, // Slow mining rate
    baseMinerals: Infinity, // Unlimited resources
    resourcesAvailable: Infinity, // Unlimited resources
    explored: true,
    unlocked: true, // Always unlocked
  }),

  // Other Planets - with adjusted distances 
  createPlanet({
    name: "Zyphora",
    description: "A lush green world with moderate resources.",
    distance: 30, // Closest planet, should be discoverable in ~5 seconds
    rate: 3,
    baseMinerals: 150,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked initially
  }),
  createPlanet({
    name: "Drakthar",
    description: "A volcanic planet with rich but hard-to-mine minerals.",
    distance: 75, // Medium distance
    rate: 8,
    baseMinerals: 80,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
  createPlanet({
    name: "Veltrion",
    description: "A frozen wasteland hiding vast mineral deposits.",
    distance: 200,
    rate: 2,
    baseMinerals: 300,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
  createPlanet({
    name: "Xandros",
    description: "A desert planet with fast mining rates but limited resources.",
    distance: 350,
    rate: 10,
    baseMinerals: 50,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
  createPlanet({
    name: "Eryndor",
    description: "A mysterious planet with balanced resources and rates.",
    distance: 500,
    rate: 6,
    baseMinerals: 200,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
  createPlanet({
    name: "Krythos",
    description: "A distant planet with legendary mineral reserves.",
    distance: 1000,
    rate: 4,
    baseMinerals: 500,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
  createPlanet({
    name: "Zerathis",
    description: "A planet with extremely fast mining rates but scarce resources.",
    distance: 1500,
    rate: 15,
    baseMinerals: 30,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
  createPlanet({
    name: "Aetherion",
    description: "A mythical planet with unparalleled mineral wealth.",
    distance: 5000,
    rate: 5,
    baseMinerals: 1000,
    resourcesAvailable: 0,
    explored: false,
    unlocked: false, // Locked by default
  }),
]);

// Function to update a specific planet's data
export const updatePlanet = (planetName, updates) => {
  planets.update((currentPlanets) =>
    currentPlanets.map((planet) =>
      planet.name === planetName ? { ...planet, ...updates } : planet
    )
  );
};

// Note: discoverPlanet function has been removed from this file
// Use the implementation from spaceship.js instead

// Mark the first non-home planet as locked initially
planets.update((currentPlanets) => {
  const firstNonHomePlanet = currentPlanets.find((planet) => !planet.isHome);
  if (firstNonHomePlanet) {
    firstNonHomePlanet.unlocked = false;
  }
  return currentPlanets;
});