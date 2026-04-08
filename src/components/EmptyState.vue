<script setup>
import { FileSearch } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Belum Ada Data'
  },
  description: {
    type: String,
    default: 'Coba cek lagi nanti ya.'
  }
})
</script>

<template>
  <div class="p-16 text-center text-gray-400">
    <FileSearch class="w-10 h-10 mx-auto mb-4 " />
    <p class="text-sm font-bold text-gray-600">{{ title }}</p>
    <p class="text-xs mt-1">{{ description }}</p>
  </div>
</template>
