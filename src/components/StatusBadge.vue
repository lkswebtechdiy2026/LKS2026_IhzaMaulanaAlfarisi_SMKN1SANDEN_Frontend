<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    default: ''
  }
})

const badgeClass = computed(() => {
  const s = (props.status || '').toLowerCase()
  if (['submitted', 'pending'].includes(s)) return 'bg-yellow-500 text-white'
  if (['reviewed'].includes(s)) return 'bg-blue-500 text-white'
  if (['approved'].includes(s)) return 'bg-green-600 text-white'
  if (['rejected'].includes(s)) return 'bg-red-600 text-white'
  return 'bg-gray-500 text-white'
})

const badgeText = computed(() => {
  const s = (props.status || '').toLowerCase()
  if (s === 'submitted' || s === 'pending') return 'Pending'
  if (s === 'reviewed') return 'Reviewed'
  if (s === 'approved') return 'Approved'
  if (s === 'rejected') return 'Rejected'
  return props.status || 'Unknown'
})
</script>

<template>
  <span class="px-2 py-1 rounded text-xs font-bold inline-block text-center min-w-[80px]" :class="badgeClass">
    {{ badgeText }}
  </span>
</template>
