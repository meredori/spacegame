import { calculateCumulativeDiscoveryChance } from './exploration.js';

// Add a cache for memoization
const calculationCache = {
  secondsToReachChance: new Map(),
  discoveryChance: new Map()
};

// Cache key generator helper
const getCacheKey = (...args) => args.join('|');

/**
 * Calculate seconds required to reach a target chance for a given distance.
 * 
 * @param {number} distance - The distance to the target planet
 * @param {number} targetChance - The chance to reach (0-1)
 * @param {number} speed - The ship's speed
 * @param {number} explorationEfficiency - The ship's exploration efficiency
 * @returns {number|string} - Seconds required or "∞" if unreachable
 */
export function calculateSecondsToReachChance(distance, targetChance, speed, explorationEfficiency) {
  // Check cache first
  const cacheKey = getCacheKey(distance, targetChance, speed, explorationEfficiency);
  if (calculationCache.secondsToReachChance.has(cacheKey)) {
    return calculationCache.secondsToReachChance.get(cacheKey);
  }
  
  // Early termination for impossible scenarios
  if (speed === 0 || explorationEfficiency === 0) {
    calculationCache.secondsToReachChance.set(cacheKey, "∞");
    return "∞";
  }
  
  // Use binary search instead of incremental approach
  let minTime = 1;
  let maxTime = 50000; // Upper limit on search time
  let iterations = 0;
  const maxIterations = 30; // Binary search needs fewer iterations
  
  // Initial quick check - if initial estimate already exceeds target chance
  const initialEstimate = Math.max(10, Math.ceil(distance / (speed * explorationEfficiency) * 10));
  let chance = calculateCumulativeDiscoveryChance(speed, explorationEfficiency, initialEstimate, distance);
  
  if (chance >= targetChance) {
    // If initial estimate is good enough, refine downward
    maxTime = initialEstimate;
  } else if (chance < 0.001) {
    // If chance is extremely low even with initial estimate, it may be impossible
    // Do a final check with a very high value
    chance = calculateCumulativeDiscoveryChance(speed, explorationEfficiency, maxTime/2, distance);
    if (chance < targetChance * 0.5) {
      calculationCache.secondsToReachChance.set(cacheKey, "∞");
      return "∞";
    }
  }
  
  // Efficient binary search
  while ((maxTime - minTime > 1) && iterations < maxIterations) {
    const midTime = Math.floor((minTime + maxTime) / 2);
    chance = calculateCumulativeDiscoveryChance(speed, explorationEfficiency, midTime, distance);
    
    if (chance < targetChance) {
      minTime = midTime;
    } else {
      maxTime = midTime;
    }
    
    iterations++;
  }
  
  let result = maxTime;
  
  // Final sanity check
  if (result >= 49000) {
    result = "∞";
  }
  
  // Cache the result
  calculationCache.secondsToReachChance.set(cacheKey, result);
  return result;
}

/**
 * Calculate discovery times for all combinations of distances and chances.
 * 
 * @param {Array<number>} distances - Array of distances to calculate for
 * @param {Array<number>} targetChances - Array of chance thresholds (0-1)
 * @param {number} speed - The ship's speed
 * @param {number} explorationEfficiency - The ship's exploration efficiency
 * @returns {Object} - Nested object with times for each distance/chance combination
 */
export function calculateDiscoveryTimesData(distances, targetChances, speed, explorationEfficiency) {
  const results = {};
  
  distances.forEach(distance => {
    results[distance] = {};
    targetChances.forEach(chance => {
      results[distance][chance] = calculateSecondsToReachChance(
        distance, 
        chance, 
        speed, 
        explorationEfficiency
      );
    });
  });
  
  return results;
}

/**
 * Calculate the maximum distance that can be discovered within a given time to reach a target chance.
 * 
 * @param {number} targetTime - Maximum time in seconds
 * @param {number} targetChance - The chance threshold (0-1)
 * @param {number} speed - The ship's speed
 * @param {number} explorationEfficiency - The ship's exploration efficiency
 * @returns {number} - Maximum achievable distance
 */
export function calculateMaxDistance(targetTime, targetChance, speed, explorationEfficiency) {
  // Start with a binary search approach
  let minDistance = 0;
  let maxDistance = 10000; // Some reasonable upper bound
  let currentDistance = 0;
  
  // Binary search to find the maximum distance
  for (let i = 0; i < 20; i++) { // 20 iterations should be enough for precision
    currentDistance = Math.floor((minDistance + maxDistance) / 2);
    
    // Calculate the time it takes to reach the target chance at this distance
    const timeRequired = calculateSecondsToReachChance(
      currentDistance, 
      targetChance, 
      speed, 
      explorationEfficiency
    );
    
    // If calculation returns infinity or exceeds target time, reduce the distance
    if (timeRequired === "∞" || timeRequired > targetTime) {
      maxDistance = currentDistance;
    } else {
      // This distance is achievable within the time, try a larger one
      minDistance = currentDistance;
    }
    
    // If we've narrowed down sufficiently
    if (maxDistance - minDistance < 2) {
      break;
    }
  }
  
  // Return the highest distance that's achievable
  return minDistance;
}

/**
 * Calculate times for specific speed/efficiency combinations at a given distance.
 * 
 * @param {number} fixedDistance - The planet distance to calculate for
 * @param {number} targetChance - The chance threshold (0-1)
 * @param {Array<number>} speedVariations - The speed values to calculate for
 * @param {Array<number>} efficiencyVariations - The efficiency values to calculate for
 * @returns {Array<Array>} - 2D array of results
 */
export function calculateTimeVariationsData(fixedDistance, targetChance, speedVariations, efficiencyVariations) {
  // Clear cache when calculating a completely new dataset to prevent excessive memory use
  if (calculationCache.secondsToReachChance.size > 1000) {
    calculationCache.secondsToReachChance.clear();
  }
  
  const results = [];
  
  speedVariations.forEach(testSpeed => {
    const speedResults = [];
    
    efficiencyVariations.forEach(testEfficiency => {
      // Calculate the time required with these parameters
      const timeRequired = calculateSecondsToReachChance(
        fixedDistance, 
        targetChance, 
        testSpeed, 
        testEfficiency
      );
      
      speedResults.push({
        speed: testSpeed,
        efficiency: testEfficiency,
        time: timeRequired
      });
    });
    
    results.push(speedResults);
  });
  
  return results;
}

/**
 * Calculate time with specific parameters
 * 
 * @param {number} distance - The distance to the target
 * @param {number} targetChance - The chance threshold (0-1)
 * @param {number} testSpeed - The speed to test
 * @param {number} testEfficiency - The efficiency to test
 * @returns {number|string} - Time required or "∞" if unreachable
 */
export function calculateTimeWithParams(distance, targetChance, testSpeed, testEfficiency) {
  return calculateSecondsToReachChance(distance, targetChance, testSpeed, testEfficiency);
}

/**
 * Format time in a more readable way (hours, minutes, seconds).
 * 
 * @param {number|string} seconds - The time in seconds or "∞"
 * @returns {string} - Formatted time string
 */
export function formatTime(seconds) {
  if (seconds === "∞") return seconds;
  
  const numSeconds = Number(seconds);
  if (numSeconds < 60) return `${numSeconds}s`;
  
  const minutes = Math.floor(numSeconds / 60);
  if (minutes < 60) {
    const remainingSeconds = Math.floor(numSeconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format seconds with comma separators for large numbers.
 * 
 * @param {number|string} seconds - The time in seconds or "∞"
 * @returns {string} - Formatted string
 */
export function formatSeconds(seconds) {
  if (seconds === "∞") return seconds;
  
  // Format with comma separators
  return seconds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get CSS class for a cell based on time value comparison with baseline.
 * 
 * @param {number|string} time - The time value
 * @param {number} baselineTime - The baseline time to compare against
 * @returns {string} - CSS class name
 */
export function getImpactCellClass(time, baselineTime) {
  if (time === "∞") return "impossible";
  if (baselineTime === "∞") return "extremely-good"; // Any finite time is better than infinity
  
  const ratio = baselineTime / time; // Inverted ratio (smaller time is better)
  
  if (ratio >= 10) return "ultra-good";      // 10x+ faster (new category for exponential)
  if (ratio >= 5) return "extremely-good";   // 5-10x faster (new category)
  if (ratio >= 2.5) return "very-good";      // 2.5-5x faster
  if (ratio >= 1.5) return "good";           // 1.5-2.5x faster
  if (ratio >= 0.9) return "baseline";       // Within 10% of baseline
  if (ratio >= 0.4) return "below-average";  // 0.4-0.9x as fast (worse)
  return "poor";                             // Less than 0.4x as fast (much worse)
}
