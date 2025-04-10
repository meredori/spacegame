<script>
    import { spaceship } from "$lib/stores/spaceship";
</script>

<div class="spaceship-details">
    <h2 class="text-lg font-bold mb-2">Spaceship: {$spaceship.name}</h2>
    <p><strong>Speed:</strong> {$spaceship.speed} units/s</p>
    <p><strong>Capacity:</strong> {$spaceship.capacity} minerals</p>
    <p><strong>Current Load:</strong> {$spaceship.currentLoad} minerals</p>
    <p><strong>Location:</strong> {$spaceship.location}</p>
    <p><strong>Status:</strong> {$spaceship.displayValue || "Idle"}</p>
    <p><strong>Exploration Efficiency:</strong> {$spaceship.explorationEfficiency}x</p>
</div>