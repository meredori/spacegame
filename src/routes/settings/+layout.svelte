<script>
	import { displayLatestMessage } from '$lib/stores/messages.svelte.svelte';
	import logo from '$lib/assets/logo.jpeg';
	import '../../app.css';
	let { children } = $props();
</script>
<nav class="flex items-center justify-between">
	<div class="w-1/5 ml-auto">
	  <img src={logo} alt="logo" class="max-h-50 object-scale-down" />
	</div>
	
	<div class="w-4/5 ml-auto"> 
		<ul class="flex border-b border-blue-300">
			<li class="mr-2"><a class="nav-link nav-active" href>Planets2</a></li>
			<li class="mr-2"><a class="nav-link" href>Space</a></li>
			<li class="mr-2"><a class="nav-link" href>Settings</a></li>
		</ul>
	</div>
  </nav>
  <div class="flex items-center justify-center">
  {#if displayLatestMessage() !== null}
	<div class="text-center">{displayLatestMessage().type}: {displayLatestMessage().message} </div>
  {/if}
  </div>
  {@render children()}
