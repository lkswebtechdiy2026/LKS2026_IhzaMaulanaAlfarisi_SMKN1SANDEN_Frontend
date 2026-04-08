<script setup>
const props = defineProps({
  status: { type: String, required: true }
})
</script>

<template>
  <div class="text-sm">
    <div v-if="status === 'submitted'">Verifikasi Data Usaha</div>
    <div v-else-if="status === 'under_review'">Analisis Kelayakan</div>
    <div v-else-if="status === 'recommended'">Rekomendasi Manager</div>
    <div v-else-if="status === 'approved'">Disetujui</div>
    <div v-else-if="status.toLowerCase().includes('rejected')">Ditolak</div>
    <div v-else>Draft</div>
  </div>
</template>
