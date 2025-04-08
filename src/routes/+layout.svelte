<script>
    import NavBar from '$lib/components/NavBar.svelte';
    import MessageDisplay from '$lib/components/MessageDisplay.svelte';
    import '../app.css';
    let { children } = $props();
</script>
<NavBar />
<div class="flex items-center justify-center">
    <MessageDisplay />
</div>
{@render children()}
