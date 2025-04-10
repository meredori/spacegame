// Placeholder for exploration-related calculations
export const calculateExplorationTime = (planet, spaceship) => {
    // TODO: Implement exploration time logic
};

// Add a memoization cache
const chanceCache = new Map();

/**
 * Calculates the chance of discovering a planet based on time elapsed, spaceship speed, exploration efficiency,
 * and planet distance using an exponential formula for more dramatic impact of stats.
 * 
 * @param {number} speed - The spaceship's speed stat
 * @param {number} explorationEfficiency - The spaceship's exploration efficiency multiplier
 * @param {number} seconds - The number of seconds elapsed in the search
 * @param {number} distance - The distance to the planet being searched for
 * @returns {number} - The chance of discovery (0-1)
 */
export const calculateDiscoveryChance = (speed, explorationEfficiency, seconds, distance = 0) => {
  // Check for cached results
  const cacheKey = `${speed}|${explorationEfficiency}|${seconds}|${distance}`;
  if (chanceCache.has(cacheKey)) {
    return chanceCache.get(cacheKey);
  }
  
  // Early exit for invalid inputs to prevent unnecessary calculations
  if (speed <= 0 || explorationEfficiency <= 0 || seconds <= 0) {
    return 0;
  }
  
  // Optimize calculation for performance
  const baseChance = 0.05; // 5% base chance
  const speedExponent = 0.6;
  const efficiencyExponent = 0.4;
  
  // Precalculate these values once
  const speedFactor = Math.pow(speed, speedExponent);
  const efficiencyFactor = Math.pow(explorationEfficiency, efficiencyExponent);
  const timeMultiplier = 0.01;
  
  // Optimize exponential calculation
  const combinedExponent = (speedFactor * efficiencyFactor) * timeMultiplier;
  const expTerm = 1 - Math.exp(-combinedExponent * seconds);
  
  let chance = baseChance + (0.95 - baseChance) * expTerm;
  
  // Apply distance penalty if distance is provided
  if (distance > 0) {
    // Optimize distance penalty calculation
    const distanceBaseline = 100;
    const statFactor = Math.sqrt(speed * explorationEfficiency) / 3;
    const distancePenalty = Math.exp(-Math.pow(distance / distanceBaseline, 1.5) / (1 + statFactor));
    chance *= distancePenalty;
  }
  
  const result = Math.min(chance, 1.0); // Cap at 100%
  
  // Cache the result (limited cache size to prevent memory issues)
  if (chanceCache.size > 10000) {
    chanceCache.clear(); // Clear if too large
  }
  chanceCache.set(cacheKey, result);
  
  return result;
};

/**
 * Calculates the cumulative chance of discovery after a certain number of seconds
 * 
 * @param {number} speed - The spaceship's speed stat
 * @param {number} explorationEfficiency - The spaceship's exploration efficiency multiplier
 * @param {number} seconds - The number of seconds elapsed
 * @param {number} distance - The distance to the planet being searched for
 * @returns {number} - The cumulative chance (0-1) of having made a discovery by this time
 */
export const calculateCumulativeDiscoveryChance = (speed, explorationEfficiency, seconds, distance = 0) => {
  const cacheKey = `cum|${speed}|${explorationEfficiency}|${seconds}|${distance}`;
  if (chanceCache.has(cacheKey)) {
    return chanceCache.get(cacheKey);
  }
  
  // Early termination for extreme cases
  if (seconds <= 0 || speed <= 0 || explorationEfficiency <= 0) {
    return 0;
  }
  
  // For very long time periods, optimize by sampling instead of calculating every second
  let cumulative = 0;
  
  // Optimize for large second values by using sampling
  if (seconds > 100) {
    // Use logarithmic sampling for large time values
    const logBase = 1.1; // Controls sampling density
    let sampledSeconds = 1;
    let prevSampledSeconds = 0;
    
    while (sampledSeconds <= seconds) {
      const chance = calculateDiscoveryChance(speed, explorationEfficiency, sampledSeconds, distance);
      
      // Each sampled period contributes proportionally
      const periodSeconds = sampledSeconds - prevSampledSeconds;
      const periodEffect = (1 - cumulative) * (1 - Math.pow(1 - chance, periodSeconds));
      cumulative += periodEffect;
      
      prevSampledSeconds = sampledSeconds;
      sampledSeconds = Math.min(seconds, Math.ceil(sampledSeconds * logBase));
    }
  } else {
    // For smaller values, use the original approach
    for (let i = 1; i <= seconds; i++) {
      const chance = calculateDiscoveryChance(speed, explorationEfficiency, i, distance);
      cumulative = cumulative + (1 - cumulative) * chance;
    }
  }
  
  // Cache the result
  if (chanceCache.size > 10000) {
    chanceCache.clear(); // Clear if too large
  }
  chanceCache.set(cacheKey, cumulative);
  
  return cumulative;
};