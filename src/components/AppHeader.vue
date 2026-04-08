<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-1 flex-col bg-white">
    <header class="h-16 flex items-center justify-between px-8 border-b border-blck  bg-white">
      <div class="flex items-center text-sm text-gray-500 font-bold">
        / Ini Dashboard yaa
      </div> 

      <div class="flex items-center gap-6">

        
    <div class="h-4 w-px bg-gray-200"></div>
    <button @click="handleLogout" class="flex items-center gap-2 text-sm text-red-600 font-bold ">
      <span>Keluar</span>
      <LogOut class="w-4 h-4" />
    </button>
  </div>
    </header>

    <main class="flex-1 bg-gray-50 p-8 min-w-[1000px]">
      <router-view />
    </main>
  </div>
</template>
