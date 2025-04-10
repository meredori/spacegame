// Placeholder for mining-related calculations
export const calculateMiningRate = (planet, spaceship) => {
    // TODO: Implement mining rate logic
};

/**
 * Calculate the mining duration for a given planet and spaceship.
 * @param {Object} planet - The planet object.
 * @param {Object} spaceship - The spaceship object.
 * @returns {number} Mining duration in milliseconds.
 */
export const calculateMiningDuration = (planet, spaceship) => {
  const miningRate = (spaceship.speed / 100) * planet.rate; // Mining rate based on spaceship speed and planet rate
  const timePerResource = 1000 / miningRate; // Time to mine one resource in milliseconds
  return Math.max(3000, timePerResource); // Ensure a minimum duration of 3 seconds
};

/**
 * Calculate the progress increment for the progress bar.
 * @param {number} duration - The total duration of the mining action in milliseconds.
 * @param {number} interval - The interval at which the progress bar updates in milliseconds.
 * @returns {number} Progress increment per interval.
 */
export const calculateMiningProgress = (duration, interval = 100) => {
  return (100 / duration) * interval;
};