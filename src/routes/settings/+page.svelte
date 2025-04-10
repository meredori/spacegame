<script>
  import ExplorationChart from '../exploration-chart.svelte';
</script>

<div class="settings-container p-6">
  <h1 class="text-2xl font-bold mb-6 text-blue-300">Settings</h1>
  
  <div class="settings-section mb-8">
    <h2 class="text-xl font-semibold mb-4 text-blue-200">Exploration Statistics</h2>
    <div class="bg-slate-800 p-4 rounded-lg shadow-md">
      <ExplorationChart />
    </div>
  </div>
  
  <!-- Placeholder for future settings sections -->
  <div class="settings-section opacity-50">
    <h2 class="text-xl font-semibold mb-2 text-blue-200">Game Settings</h2>
    <p class="text-slate-400">Additional settings coming soon...</p>
  </div>
</div>