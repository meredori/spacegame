<script>
    import NavbarLink from './NavbarLink.svelte';
    import logo from '$lib/assets/logo.jpeg';
  </script>
  
  <nav class="flex items-center justify-between p-4">
    <div class="flex items-center">
      <img src={logo} alt="logo" class="h-16 object-contain mr-4" />
      <span class="text-xl font-bold text-blue-300">Space Game</span>
    </div>
    <ul class="flex space-x-4">
      <NavbarLink href="/" label="Planets" />
      <NavbarLink href="/space" label="Space" />
      <NavbarLink href="/settings" label="Settings" />
    </ul>
  </nav>