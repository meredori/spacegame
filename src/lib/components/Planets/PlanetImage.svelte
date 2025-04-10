<script>
    export let planet; // Ensure planet is passed as a prop
</script>

<img
    class="planet-image mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0"
    src="https://picsum.photos/150?random={planet.rate}"
    alt="{planet.name}"
/>