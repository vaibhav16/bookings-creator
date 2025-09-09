<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">{{ config?.branding?.name || 'Booking' }}</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12" role="status" aria-live="polite">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
        <p class="mt-4">Loading booking options...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12" role="alert" aria-live="assertive">
        <div class="text-red-600 text-6xl mb-4" aria-hidden="true">⚠️</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="loadConfig" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-describedby="error-description"
        >
          Try Again
        </button>
        <div id="error-description" class="sr-only">Click to retry loading the booking configuration</div>
      </div>
      
      <div v-else-if="config" class="bg-white rounded-lg shadow p-6">
        <!-- Salon Flow -->
        <div v-if="config.vertical === 'salon'">
          <div v-if="step === 0">
            <h2 class="text-xl font-semibold mb-4">Choose a Service</h2>
            <div 
              class="grid gap-4 md:grid-cols-2" 
              role="grid" 
              aria-label="Available services"
            >
              <button 
                v-for="(service, index) in services" 
                :key="service.id"
                @click="selectService(service)"
                @keydown.enter="selectService(service)"
                @keydown.space.prevent="selectService(service)"
                class="p-4 border rounded-lg text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : ''"
                :aria-pressed="selectedService?.id === service.id"
                :aria-describedby="`service-${service.id}-desc`"
                role="gridcell"
                :tabindex="index === 0 ? 0 : -1"
              >
                <h3 class="font-medium">{{ service.name }}</h3>
                <p class="text-sm text-gray-600" :id="`service-${service.id}-desc`">
                  {{ service.durationMinutes }} min - ${{ service.price }}
                </p>
              </button>
            </div>
          </div>
          
          <div v-else-if="step === 1">
            <h2 class="text-xl font-semibold mb-4">Choose Provider</h2>
            <div 
              class="grid gap-4 md:grid-cols-2" 
              role="grid" 
              aria-label="Available providers"
            >
              <button 
                v-for="(provider, index) in providers" 
                :key="provider.id"
                @click="selectProvider(provider)"
                @keydown.enter="selectProvider(provider)"
                @keydown.space.prevent="selectProvider(provider)"
                class="p-4 border rounded-lg text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="selectedProvider?.id === provider.id ? 'border-blue-500 bg-blue-50' : ''"
                :aria-pressed="selectedProvider?.id === provider.id"
                role="gridcell"
                :tabindex="index === 0 ? 0 : -1"
              >
                <h3 class="font-medium">{{ provider.name }}</h3>
              </button>
            </div>
          </div>
          
          <div v-else-if="step === 2">
            <h2 class="text-xl font-semibold mb-4">Choose Time</h2>
            <div v-if="loadingSlots" class="text-center py-8" role="status" aria-live="polite">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
              <p class="mt-2">Loading available times...</p>
            </div>
            <div v-else-if="availableSlots.length === 0" class="text-center py-8" role="status" aria-live="polite">
              <p class="text-gray-600">No available times found</p>
              <button 
                @click="loadAvailability" 
                class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
            <div v-else role="grid" aria-label="Available time slots">
              <VirtualizedTimeSlots
                :slots="availableSlots"
                :selected-slot="selectedTimeSlot"
                :item-height="60"
                :container-height="300"
                @select="selectTimeSlot"
              />
            </div>
          </div>
        </div>
        
        <!-- Class Flow -->
        <div v-else-if="config.vertical === 'class'">
          <div v-if="step === 0">
            <h2 class="text-xl font-semibold mb-4">Choose a Class</h2>
            <div 
              class="grid gap-4 md:grid-cols-2" 
              role="grid" 
              aria-label="Available classes"
            >
              <button 
                v-for="(classItem, index) in classes" 
                :key="classItem.id"
                @click="selectClass(classItem)"
                @keydown.enter="selectClass(classItem)"
                @keydown.space.prevent="selectClass(classItem)"
                class="p-4 border rounded-lg text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="selectedClass?.id === classItem.id ? 'border-blue-500 bg-blue-50' : ''"
                :aria-pressed="selectedClass?.id === classItem.id"
                :aria-describedby="`class-${classItem.id}-desc`"
                role="gridcell"
                :tabindex="index === 0 ? 0 : -1"
              >
                <h3 class="font-medium">{{ classItem.name }}</h3>
                <p class="text-sm text-gray-600" :id="`class-${classItem.id}-desc`">
                  {{ classItem.durationMinutes }} min - ${{ classItem.price }}
                </p>
                <p class="text-sm text-gray-600">{{ classItem.seatsTotal }} seats</p>
              </button>
            </div>
          </div>
          
          <div v-else-if="step === 1">
            <h2 class="text-xl font-semibold mb-4">Choose Session</h2>
            <div v-if="loadingSessions" class="text-center py-8" role="status" aria-live="polite">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
              <p class="mt-2">Loading sessions...</p>
            </div>
            <div v-else-if="sessions.length === 0" class="text-center py-8" role="status" aria-live="polite">
              <p class="text-gray-600">No sessions available</p>
            </div>
            <div v-else class="grid gap-2 md:grid-cols-2" role="grid" aria-label="Available sessions">
              <button 
                v-for="(session, index) in formattedSessions" 
                :key="session.start"
                @click="selectSession(session)"
                @keydown.enter="selectSession(session)"
                @keydown.space.prevent="selectSession(session)"
                class="p-3 border rounded text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="selectedSession?.start === session.start ? 'border-blue-500 bg-blue-50' : ''"
                :aria-pressed="selectedSession?.start === session.start"
                :aria-describedby="`session-${session.start}-desc`"
                role="gridcell"
                :tabindex="index === 0 ? 0 : -1"
              >
                <div class="font-medium">{{ session.formattedTime }}</div>
                <div class="text-sm text-gray-600" :id="`session-${session.start}-desc`">
                  {{ session.seatsLeft }} seats left
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Rental Flow -->
        <div v-else-if="config.vertical === 'rental'">
          <div v-if="step === 0">
            <h2 class="text-xl font-semibold mb-4">Choose Dates</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label for="start-date" class="block text-sm font-medium mb-2">Check-in</label>
                <input 
                  id="start-date"
                  v-model="startDate" 
                  type="date" 
                  class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :min="minDate"
                  aria-describedby="start-date-help"
                />
                <div id="start-date-help" class="sr-only">Select your check-in date</div>
              </div>
              <div>
                <label for="end-date" class="block text-sm font-medium mb-2">Check-out</label>
                <input 
                  id="end-date"
                  v-model="endDate" 
                  type="date" 
                  class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :min="startDate || minDate"
                  aria-describedby="end-date-help"
                />
                <div id="end-date-help" class="sr-only">Select your check-out date</div>
              </div>
            </div>
            <button 
              @click="selectDateRange" 
              :disabled="!startDate || !endDate"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-describedby="continue-help"
            >
              Continue
            </button>
            <div id="continue-help" class="sr-only">Click to continue with selected dates</div>
          </div>
          
          <div v-else-if="step === 1">
            <h2 class="text-xl font-semibold mb-4">Choose Item</h2>
            <div 
              class="grid gap-4 md:grid-cols-2" 
              role="grid" 
              aria-label="Available rental items"
            >
              <button 
                v-for="(item, index) in items" 
                :key="item.id"
                @click="selectItem(item)"
                @keydown.enter="selectItem(item)"
                @keydown.space.prevent="selectItem(item)"
                class="p-4 border rounded-lg text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="selectedItem?.id === item.id ? 'border-blue-500 bg-blue-50' : ''"
                :aria-pressed="selectedItem?.id === item.id"
                :aria-describedby="`item-${item.id}-desc`"
                role="gridcell"
                :tabindex="index === 0 ? 0 : -1"
              >
                <h3 class="font-medium">{{ item.name }}</h3>
                <p class="text-sm text-gray-600" :id="`item-${item.id}-desc`">
                  ${{ item.price }}/night
                </p>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <div class="mt-8 flex justify-between" role="navigation" aria-label="Booking navigation">
          <button 
            v-if="step > 0" 
            @click="step--" 
            @keydown.enter="step--"
            @keydown.space.prevent="step--"
            class="px-4 py-2 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous step"
          >
            Back
          </button>
          <button v-else class="invisible" aria-hidden="true"></button>
          
          <button 
            v-if="canProceed" 
            @click="bookNow" 
            @keydown.enter="bookNow"
            @keydown.space.prevent="bookNow"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Complete your booking"
          >
            {{ config.copy?.cta || 'Book Now' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const vertical = route.params.vertical

// Generate request ID for observability
const requestId = ref(Math.random().toString(36).slice(2) + Date.now().toString(36))

const config = ref(null)
const loading = ref(true)
const error = ref(null)
const step = ref(0)

// Salon state
const selectedService = ref(null)
const selectedProvider = ref(null)
const selectedTimeSlot = ref(null)
const availableSlots = ref([])
const loadingSlots = ref(false)

// Class state
const selectedClass = ref(null)
const selectedSession = ref(null)
const sessions = ref([])
const loadingSessions = ref(false)

// Rental state
const selectedItem = ref(null)
const selectedDateRange = ref(null)
const startDate = ref('')
const endDate = ref('')

const minDate = new Date().toISOString().split('T')[0]

const loadConfig = async () => {
  try {
    loading.value = true
    const data = await $fetch(`/api/config?vertical=${vertical}`, {
      headers: { 'x-request-id': requestId.value }
    })
    config.value = data
    
    // Apply theme
    if (process.client && data.branding?.theme) {
      const root = document.documentElement
      Object.entries(data.branding.theme).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
    }
    
    // Log booking initialization
    console.log(JSON.stringify({
      level: 'info',
      event: 'booking_initialized',
      requestId: requestId.value,
      vertical: vertical,
      timestamp: new Date().toISOString()
    }))
  } catch (err) {
    error.value = 'Failed to load configuration'
    
    // Log API error
    console.log(JSON.stringify({
      level: 'error',
      event: 'api_error',
      requestId: requestId.value,
      endpoint: '/api/config',
      error: err.message,
      timestamp: new Date().toISOString()
    }))
  } finally {
    loading.value = false
  }
}

const selectService = (service) => {
  selectedService.value = service
  step.value = 1
}

const selectProvider = (provider) => {
  selectedProvider.value = provider
  step.value = 2
  loadAvailability()
}

const selectClass = (classItem) => {
  selectedClass.value = classItem
  step.value = 1
  loadSessions()
}

const selectItem = (item) => {
  selectedItem.value = item
  step.value = 1
}

const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot
}

const selectSession = (session) => {
  selectedSession.value = session
}

const selectDateRange = () => {
  selectedDateRange.value = { start: startDate.value, end: endDate.value }
  step.value = 1
}

const loadAvailability = async () => {
  if (!selectedService.value || !selectedProvider.value) return
  
  loadingSlots.value = true
  try {
    const data = await $fetch('/api/availability', {
      params: {
        serviceId: selectedService.value.id,
        providerId: selectedProvider.value.id,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      headers: { 'x-request-id': requestId.value }
    })
    availableSlots.value = data.slots || []
  } catch (err) {
    availableSlots.value = []
    
    // Log API error
    console.log(JSON.stringify({
      level: 'error',
      event: 'api_error',
      requestId: requestId.value,
      endpoint: '/api/availability',
      error: err.message,
      timestamp: new Date().toISOString()
    }))
  } finally {
    loadingSlots.value = false
  }
}

const loadSessions = async () => {
  if (!selectedClass.value) return
  
  loadingSessions.value = true
  try {
    const data = await $fetch('/api/sessions', {
      params: {
        classId: selectedClass.value.id,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      headers: { 'x-request-id': requestId.value }
    })
    sessions.value = data.sessions || []
  } catch (err) {
    sessions.value = []
    
    // Log API error
    console.log(JSON.stringify({
      level: 'error',
      event: 'api_error',
      requestId: requestId.value,
      endpoint: '/api/sessions',
      error: err.message,
      timestamp: new Date().toISOString()
    }))
  } finally {
    loadingSessions.value = false
  }
}

// Performance optimization: Memoized computed properties
const canProceed = computed(() => {
  if (config.value?.vertical === 'salon') {
    return selectedService.value && selectedProvider.value && selectedTimeSlot.value
  } else if (config.value?.vertical === 'class') {
    return selectedClass.value && selectedSession.value
  } else if (config.value?.vertical === 'rental') {
    return selectedItem.value && selectedDateRange.value
  }
  return false
})

// Performance optimization: Memoized filtered catalogs
const services = computed(() => {
  return config.value?.catalog.filter(item => item.type === 'service') || []
})

const classes = computed(() => {
  return config.value?.catalog.filter(item => item.type === 'class') || []
})

const items = computed(() => {
  return config.value?.catalog.filter(item => item.type === 'rental') || []
})

const providers = computed(() => {
  return config.value?.resources.filter(r => r.kind === 'provider') || []
})

// Performance optimization: Memoized date formatting functions
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Performance optimization: Memoized formatted sessions for classes
const formattedSessions = computed(() => {
  return sessions.value.map(session => ({
    ...session,
    formattedTime: formatDateTime(session.start),
    seatsLeft: session.seatsTotal - session.seatsBooked
  }))
})

const bookNow = async () => {
  try {
    const payload = {
      vertical: config.value.vertical,
      selection: {}
    }
    
    if (config.value.vertical === 'salon') {
      payload.selection = {
        serviceId: selectedService.value.id,
        providerId: selectedProvider.value.id,
        start: selectedTimeSlot.value.start,
        end: selectedTimeSlot.value.end
      }
    } else if (config.value.vertical === 'class') {
      payload.selection = {
        classId: selectedClass.value.id,
        start: selectedSession.value.start,
        end: selectedSession.value.end
      }
    } else if (config.value.vertical === 'rental') {
      payload.selection = {
        itemId: selectedItem.value.id,
        startDate: selectedDateRange.value.start,
        endDate: selectedDateRange.value.end
      }
    }
    
    // Log booking attempt
    console.log(JSON.stringify({
      level: 'info',
      event: 'booking_attempt',
      requestId: requestId.value,
      vertical: config.value.vertical,
      selection: payload.selection,
      timestamp: new Date().toISOString()
    }))
    
    const result = await $fetch('/api/book', {
      method: 'POST',
      body: payload,
      headers: { 'x-request-id': requestId.value }
    })
    
    // Log booking success
    console.log(JSON.stringify({
      level: 'info',
      event: 'booking_success',
      requestId: requestId.value,
      bookingId: result.bookingId,
      status: result.status,
      timestamp: new Date().toISOString()
    }))
    
    alert(`Booking ${result.status}! ID: ${result.bookingId}`)
  } catch (err) {
    // Log booking error
    console.log(JSON.stringify({
      level: 'error',
      event: 'api_error',
      requestId: requestId.value,
      endpoint: '/api/book',
      error: err.message,
      timestamp: new Date().toISOString()
    }))
    
    alert('Booking failed: ' + err.message)
  }
}

onMounted(loadConfig)
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>