import { writable } from 'svelte/store';

// Initialize the planet store with default data
export const planets = writable([
  {
    name: "Terra Prime",
    isHome: true,
    description: "The home planet of humanity.",
    distance: 0,
    rate: 5,
    baseMinerals: 100,
    resourcesAvailable: 100,
    explored: true,
  },
  {
    name: "Mars Colony",
    isHome: false,
    description: "A red planet rich in iron.",
    distance: 50,
    rate: 3,
    baseMinerals: 80,
    resourcesAvailable: 0,
    explored: false,
  },
  // Add more planets as needed
]);

// Function to update a specific planet's data
export const updatePlanet = (planetName, updates) => {
  planets.update((currentPlanets) =>
    currentPlanets.map((planet) =>
      planet.name === planetName ? { ...planet, ...updates } : planet
    )
  );
};