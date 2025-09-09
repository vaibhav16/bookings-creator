<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Widget Demo</h1>
      
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Salon Widget</h2>
        <div id="ghl-booking-salon" data-config="/configs/salon.json"></div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Implementation</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto"><code>&lt;div id="ghl-booking" data-config="/configs/salon.json"&gt;&lt;/div&gt;
&lt;script src="/widget.js" async&gt;&lt;/script&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  script: [{ src: '/widget.js', async: true }]
})
</script>
