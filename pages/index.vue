<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-8">Universal Booking Platform</h1>
      
      <div class="space-y-4">
        <NuxtLink to="/booking/salon" class="block w-full p-4 border rounded-lg text-center hover:bg-gray-50">
          Salon Booking
        </NuxtLink>
        <NuxtLink to="/booking/class" class="block w-full p-4 border rounded-lg text-center hover:bg-gray-50">
          Class Booking
        </NuxtLink>
        <NuxtLink to="/booking/rental" class="block w-full p-4 border rounded-lg text-center hover:bg-gray-50">
          Rental Booking
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
