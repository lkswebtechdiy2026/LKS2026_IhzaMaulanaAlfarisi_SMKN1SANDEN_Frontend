<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const menuLinks = computed(() => {
  const role = authStore.role?.toLowerCase()
  const links = [
    { name: 'Dashboard', path: '/dashboard' }
  ]

  if (role === 'applicant') {
    links.push({ name: 'Verifikasi Usaha', path: '/business' })
    links.push({ name: 'Ajukan Pinjaman', path: '/applications/new' })
  } else if (role === 'verifier') {
    links.push({ name: 'Verifikasi Bisnis', path: '/verifications' })
  }

  return links
})
</script>

<template>
  <aside class="w-64 bg-[#0B132A] flex flex-col h-screen shrink-0 text-white font-['Inter',sans-serif]">
    <div class="h-20 flex items-center px-8 border-b border-white/10">
      <span class="text-2xl font-bold text-white tracking-tight">FA UMKM</span>
    </div>

    <div class="flex-1 py-8">
      <nav class="px-4 space-y-1">
        <router-link
          v-for="link in menuLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all"
          :class="[
            route.path === link.path
              ? 'bg-[#F53838] text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          ]"
        >
          {{ link.name }}
        </router-link>
      </nav>
    </div>

    <div class="p-4 border-t border-white/10">
      <button 
        @click="authStore.logout()"
        class="w-full text-left px-4 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
      >
        Keluar
      </button>
    </div>
  </aside>
</template>
