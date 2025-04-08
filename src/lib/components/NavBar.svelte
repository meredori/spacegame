<script>
    import logo from '$lib/assets/logo.jpeg';
</script>

<nav class="flex flex-wrap items-center justify-between p-4">
    <!-- Logo Section -->
    <div class="flex items-center w-full md:w-auto mb-4 md:mb-0">
        <img src={logo} alt="logo" class="h-16 object-contain mr-4" />
        <span class="text-xl font-bold text-blue-300">Space Game</span>
    </div>

    <!-- Navigation Section -->
    <div class="w-full md:w-auto">
        <ul class="flex flex-col md:flex-row md:items-center text-center md:text-left">
            <li class="mb-2 md:mb-0">
                <a class="nav-link nav-active block md:inline-block py-2 px-4 rounded md:rounded-none border md:border-none border-blue-300 md:border-transparent" href>Planets</a>
            </li>
            <li class="mb-2 md:mb-0">
                <a class="nav-link block md:inline-block py-2 px-4 rounded md:rounded-none border md:border-none border-blue-300 md:border-transparent" href>Space</a>
            </li>
            <li class="mb-2 md:mb-0">
                <a class="nav-link block md:inline-block py-2 px-4 rounded md:rounded-none border md:border-none border-blue-300 md:border-transparent" href>Settings</a>
            </li>
        </ul>
    </div>
</nav>