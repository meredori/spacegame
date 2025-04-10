<script>
    import { spaceship } from "$lib/stores/spaceship";
    export let color = "bg-gray-500"; // Default color
</script>

<div class="progress-bar bg-gray-700 rounded-full h-4 mt-4">
    <div
        class={`progress h-full rounded-full ${color}`}
        style="width: {$spaceship.progress}%"
    ></div>
</div>