<script>
  import { 
    calculateDiscoveryTimesData,
    calculateMaxDistance,
    calculateSecondsToReachChance,
    calculateTimeVariationsData,
    formatSeconds,
    formatTime,
    getImpactCellClass
  } from '$lib/utils/explorationChartUtils.js';
  
  // Parameters
  const speed = 10;
  const explorationEfficiency = 1;
  
  // Target discovery chances
  const targetChances = [0.5, 0.9, 0.99];
  
  // Distances to display
  const distances = [0, 50, 100, 200, 500, 1000];
  
  // State for the distance calculator
  let targetTime = 300; // Default 5 minutes
  let calculatedDistance = $state(0);
  let chance90AtDistance = $state(0);
  let chance99AtDistance = $state(0);
  
  // State for the impact chart
  let impactChartData = $state([]);
  let selectedTargetChance = $state(0.5);
  let fixedDistance = $state(0);
  let baselineTime = $state(0);
  
  // Speed and efficiency variations for impact analysis
  const speedVariations = [5, 10, 15, 20, 30, 50];
  const efficiencyVariations = [0.5, 1, 1.5, 2, 3, 5];
  
  // Calculate the main discovery times table data
  const data = calculateDiscoveryTimesData(
    distances, 
    targetChances, 
    speed, 
    explorationEfficiency
  );
  
  // Format the chance percentage
  const formatChanceLabel = (chance) => (chance * 100) + "%";
  
  // Calculate times for 90% and 99% chances at a given distance
  function calculateAdditionalChances(distance) {
    const time90 = calculateSecondsToReachChance(distance, 0.9, speed, explorationEfficiency);
    const time99 = calculateSecondsToReachChance(distance, 0.99, speed, explorationEfficiency);
    return { time90, time99 };
  }
  
  // Update calculated distance when target time changes
  function updateCalculatedDistance() {
    calculatedDistance = calculateMaxDistance(
      targetTime, 
      0.5, // Fixed at 50% for the distance calculator
      speed, 
      explorationEfficiency
    );
    
    const { time90, time99 } = calculateAdditionalChances(calculatedDistance);
    chance90AtDistance = time90;
    chance99AtDistance = time99;
    
    // After calculating the distance, update the impact chart with this distance
    fixedDistance = calculatedDistance;
    updateImpactChart();
  }
  
  // Calculate times for different speed/efficiency combinations at a fixed distance
  function updateImpactChart() {
    // Calculate the baseline time (current ship stats)
    baselineTime = calculateSecondsToReachChance(
      fixedDistance,
      selectedTargetChance, 
      speed, 
      explorationEfficiency
    );
    
    // Calculate times for all speed/efficiency combinations
    impactChartData = calculateTimeVariationsData(
      fixedDistance,
      selectedTargetChance,
      speedVariations,
      efficiencyVariations
    );
  }
  
  // Initialize calculations
  $effect(() => {
    updateCalculatedDistance();
  });
  
  // Format value for display
  function formatValue(value) {
    if (value === "∞") return "∞";
    return value.toLocaleString();
  }
</script>

<div class="exploration-table-container">
  <h2>Planet Discovery Time Calculator</h2>
  <p class="params">Speed: {speed} | Exploration Efficiency: {explorationEfficiency}</p>
  
  <div class="description mb-4">
    <p>This table shows the estimated seconds required to reach specific discovery chances for planets at various distances.</p>
  </div>
  
  <table class="discovery-table">
    <thead>
      <tr>
        <th>Distance</th>
        {#each targetChances as chance}
          <th>Time to {formatChanceLabel(chance)}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each distances as distance}
        <tr>
          <td class="distance-cell">{distance}</td>
          {#each targetChances as chance}
            <td class={data[distance][chance] === "∞" ? "impossible" : data[distance][chance] > 3600 ? "very-long" : data[distance][chance] > 600 ? "long" : "reasonable"}>
              {formatSeconds(data[distance][chance])} {data[distance][chance] !== "∞" ? "seconds" : ""}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  
  <div class="calculator-box mb-6 p-4 border border-blue-300 rounded-lg bg-slate-700">
    <h3 class="text-lg font-semibold mb-3">Distance Calculator</h3>
    <p class="text-sm mb-3">Calculate maximum discoverable distance within a given time (for 50% discovery chance):</p>
    
    <div class="flex items-center gap-4 flex-wrap mb-4">
      <div class="input-group">
        <label for="targetTime" class="mr-2">Target time (seconds):</label>
        <input 
          id="targetTime"
          type="number" 
          bind:value={targetTime}
          min="1"
          class="bg-slate-800 text-white px-2 py-1 w-24 rounded border border-blue-300"
        />
      </div>
      
      <button 
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        on:click={updateCalculatedDistance}
      >
        Calculate
      </button>
    </div>
    
    <div class="results-container">
      <div class="result-row">
        <span class="font-semibold">Maximum distance:</span>
        <span class="text-xl ml-2">{calculatedDistance} units</span>
      </div>
      
      <div class="text-sm text-blue-200 mt-3 mb-1">For a planet at this distance:</div>
      
      <div class="result-row text-sm">
        <span>50% chance time:</span>
        <span class="ml-2">{formatTime(targetTime)}</span>
      </div>
      
      <div class="result-row text-sm">
        <span>90% chance time:</span>
        <span class="ml-2 {chance90AtDistance === '∞' ? 'text-red-300' : ''}">{formatTime(chance90AtDistance)}</span>
      </div>
      
      <div class="result-row text-sm">
        <span>99% chance time:</span>
        <span class="ml-2 {chance99AtDistance === '∞' ? 'text-red-300' : ''}">{formatTime(chance99AtDistance)}</span>
      </div>
    </div>
  </div>
  
  <div class="impact-chart-container mt-8 mb-6 p-4 border border-blue-300 rounded-lg bg-slate-700">
    <h3 class="text-lg font-semibold mb-3">Upgrade Impact Analysis</h3>
    <p class="text-sm mb-3">
      This chart shows the time required to reach {selectedTargetChance * 100}% discovery chance for a
      planet at distance {fixedDistance} with different combinations of speed and exploration efficiency.
    </p>
    
    <div class="mb-4">
      <label class="mr-2">Target chance:</label>
      <select 
        bind:value={selectedTargetChance} 
        on:change={updateImpactChart}
        class="bg-slate-800 text-white px-2 py-1 rounded border border-blue-300"
      >
        <option value={0.5}>50%</option>
        <option value={0.9}>90%</option>
        <option value={0.99}>99%</option>
      </select>
      
      <button 
        class="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        on:click={updateImpactChart}
      >
        Recalculate
      </button>
    </div>
    
    <div class="impact-chart-wrapper">
      <table class="impact-chart">
        <thead>
          <tr>
            <th class="corner-header">Speed ↓ Efficiency →</th>
            {#each efficiencyVariations as efficiency}
              <th>{efficiency}x</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each impactChartData as speedRow, speedIndex}
            <tr>
              <th>{speedVariations[speedIndex]}</th>
              {#each speedRow as cell, effIndex}
                {@const baseline = cell.speed === speed && cell.efficiency === explorationEfficiency}
                {@const cellClass = getImpactCellClass(cell.time, baselineTime)}
                <td class={`${cellClass} ${baseline ? 'baseline-cell' : ''}`}>
                  {formatTime(cell.time)}
                  {#if baseline}<span class="baseline-marker">*</span>{/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    <div class="impact-legend mt-4">
      <div class="legend-item">
        <span class="legend-color baseline"></span>
        <span>Current Level (Baseline)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color ultra-good"></span>
        <span>10x+ Faster</span>
      </div>
      <div class="legend-item">
        <span class="legend-color extremely-good"></span>
        <span>5-10x Faster</span>
      </div>
      <div class="legend-item">
        <span class="legend-color very-good"></span>
        <span>2.5-5x Faster</span>
      </div>
      <div class="legend-item">
        <span class="legend-color good"></span>
        <span>1.5-2.5x Faster</span>
      </div>
      <div class="legend-item">
        <span class="legend-color below-average"></span>
        <span>0.4-0.9x (Slower)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color poor"></span>
        <span>&lt;0.4x (Much Slower)</span>
      </div>
    </div>
  </div>
  
  <div class="legend">
    <div class="legend-item">
      <span class="legend-color reasonable"></span>
      <span>Reasonable (≤10 minutes)</span>
    </div>
    <div class="legend-item">
      <span class="legend-color long"></span>
      <span>Long (10-60 minutes)</span>
    </div>
    <div class="legend-item">
      <span class="legend-color very-long"></span>
      <span>Very Long (>60 minutes)</span>
    </div>
    <div class="legend-item">
      <span class="legend-color impossible"></span>
      <span>Practically Impossible</span>
    </div>
  </div>
</div>

<style>
  .exploration-table-container {
    font-family: system-ui, sans-serif;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .params {
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  .description {
    color: #aaa;
    font-size: 0.9rem;
  }
  
  .discovery-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
  }
  
  .discovery-table th,
  .discovery-table td {
    padding: 0.75rem;
    text-align: center;
    border: 1px solid #444;
  }
  
  .discovery-table th {
    background-color: #222;
    color: white;
  }
  
  .distance-cell {
    font-weight: bold;
    background-color: #333;
    color: #eee;
  }
  
  .reasonable {
    background-color: #d4edda;
    color: #155724;
  }
  
  .long {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .very-long {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .impossible {
    background-color: #343a40;
    color: #adb5bd;
    font-style: italic;
  }
  
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-color {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #555;
  }
  
  .legend-color.reasonable {
    background-color: #d4edda;
  }
  
  .legend-color.long {
    background-color: #fff3cd;
  }
  
  .legend-color.very-long {
    background-color: #f8d7da;
  }
  
  .legend-color.impossible {
    background-color: #343a40;
  }
  
  .calculator-box {
    background-color: rgba(30, 41, 59, 0.8);
  }
  
  input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
  
  .result-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.25rem 1rem;
    border-bottom: 1px solid rgba(100, 116, 139, 0.3);
  }
  
  .text-red-300 {
    color: #fca5a5;
  }
  
  .impact-chart {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  .impact-chart th,
  .impact-chart td {
    padding: 0.5rem;
    text-align: center;
    border: 1px solid #444;
    font-size: 0.9rem;
  }
  
  .impact-chart th {
    background-color: #222;
    color: white;
  }
  
  .corner-header {
    background-color: #333;
    font-size: 0.75rem;
  }
  
  .impact-chart-wrapper {
    max-width: 100%;
    overflow-x: auto;
  }
  
  .impact-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    font-size: 0.9rem;
  }
  
  .baseline-cell {
    font-weight: bold;
    border: 2px solid #4a83c7;
  }
  
  .baseline-marker {
    color: #4a83c7;
    font-weight: bold;
    margin-left: 2px;
  }
  
  .ultra-good {
    background-color: #68d391;
    color: #14532d;
  }
  
  .extremely-good {
    background-color: #9ae6b4;
    color: #1c4532;
  }
  
  .very-good {
    background-color: #c6f6d5;
    color: #22543d;
  }
  
  .good {
    background-color: #d4edda;
    color: #155724;
  }
  
  .baseline {
    background-color: #cce5ff;
    color: #004085;
  }
  
  .below-average {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .poor {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .legend-color.ultra-good {
    background-color: #68d391;
  }
  
  .legend-color.extremely-good {
    background-color: #9ae6b4;
  }
  
  .legend-color.very-good {
    background-color: #c6f6d5;
  }
  
  .legend-color.good {
    background-color: #d4edda;
  }
  
  .legend-color.baseline {
    background-color: #cce5ff;
  }
  
  .legend-color.below-average {
    background-color: #fff3cd;
  }
  
  .legend-color.poor {
    background-color: #f8d7da;
  }
</style>