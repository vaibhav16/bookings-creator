<template>
  <div class="relative overflow-y-auto" :style="{ height: containerHeight + 'px' }" @scroll="onScroll">
    <div :style="{ height: totalHeight + 'px' }">
      <button
        v-for="(slot, index) in visibleSlots"
        :key="slot.start"
        @click="$emit('select', slot)"
        @keydown.enter="$emit('select', slot)"
        @keydown.space.prevent="$emit('select', slot)"
        class="absolute w-full p-3 border rounded text-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :class="selectedSlot?.start === slot.start ? 'border-blue-500 bg-blue-50' : ''"
        :style="{ top: (startIndex + index) * itemHeight + 'px' }"
        :aria-pressed="selectedSlot?.start === slot.start"
        role="gridcell"
        :tabindex="(startIndex + index) === 0 ? 0 : -1"
      >
        {{ formatTime(slot.start) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  slots: {
    type: Array,
    required: true
  },
  selectedSlot: {
    type: Object,
    default: null
  },
  itemHeight: {
    type: Number,
    default: 40
  },
  containerHeight: {
    type: Number,
    default: 200
  }
})

const emit = defineEmits(['select'])

const scrollTop = ref(0)
const visibleItemsCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - visibleItemsCount.value))
const endIndex = computed(() => Math.min(props.slots.length, startIndex.value + (visibleItemsCount.value * 3)))
const totalHeight = computed(() => props.slots.length * props.itemHeight)

const visibleSlots = computed(() => {
  return props.slots.slice(startIndex.value, endIndex.value)
})

const onScroll = (event) => {
  scrollTop.value = event.target.scrollTop
}

// Memoized time formatting
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

watch(() => props.selectedSlot, (newVal) => {
  if (newVal) {
    const index = props.slots.findIndex(s => s.start === newVal.start)
    if (index !== -1) {
      const targetScrollTop = index * props.itemHeight
      if (targetScrollTop < scrollTop.value || targetScrollTop > scrollTop.value + props.containerHeight - props.itemHeight) {
        // Auto-scroll to selected item if needed
      }
    }
  }
})
</script>