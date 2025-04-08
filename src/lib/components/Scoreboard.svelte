<script>
	import { invalidate } from "$app/navigation";
    import { minerals } from "$lib/stores/resources";
	import { onMount } from "svelte";
</script>

<div class="scoreboard flex flex-col items-center p-4 border border-blue-300 rounded-lg shadow-md bg-blue-950 text-blue-50">
    <h2 class="text-lg font-bold mb-2">Scoreboard</h2>
    <div class="flex flex-row items-center gap-4">
        <div class="mineral-count">
            <span class="font-semibold">Minerals:</span>
            <span class="text-xl font-bold">{$minerals.count}</span>
        </div>
        <div class="mineral-multiplier">
            <span class="font-semibold">Multiplier:</span>
            <span class="text-xl font-bold">{$minerals.multiplier}</span>
        </div>
    </div>
</div>