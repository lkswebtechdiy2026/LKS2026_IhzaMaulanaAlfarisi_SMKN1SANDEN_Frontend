<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    email: '',
    password: ''
})

const handleLogin = async () => {
    const success = await authStore.login(form.value)
    if (success) {
        router.push('/dashboard')
    }
}
</script>

<template>

    <div class="min-h-screen flex items-center justify-center bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
        <div class="bg-white p-10 rounded-[10px] border border-black w-full max-w-[450px]">
            <div class="text-center mb-8">
                <div class="flex items-center justify-center gap-2.5 mb-6">
                    <span class="text-2xl font-bold text-[#0B132A]">PT FA UMKM</span>
                </div>


                <h2 class="text-[28px] font-medium text-[#0B132A] mb-2">Masuk ke Akun</h2>
                <p class="text-[#4F5665]">Silakan masukkan email dan password Anda</p>
                
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label class="block text-[#0B132A] text-sm font-medium mb-2">Email</label>
                    <input 
                        v-model="form.email" 
                        type="email" 
                        required 
                        class="w-full px-4 py-3 border border-gray-200 rounded-md text-[#4F5665] placeholder-gray-400 "
                        placeholder="Masukkan email"
                    >
                </div>


                
                <div>
                    <label class="block text-[#0B132A] text-sm font-medium mb-2">Password</label>
                    <input 
                        v-model="form.password" 
                        type="password" 
                        required 
                        class="w-full px-4 py-3 border border-gray-200 rounded-md text-[#4F5665] placeholder-gray-400 "
                        placeholder="Masukkan password"
                    >
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-[#F53838] text-white font-bold py-3.5 px-4 rounded-md "
                >
                    Masuk 
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-[#4F5665]">
                Belum punya akun? 

                
                <button type="button" @click="router.push('/register')" class="text-[#F53838] font-medium ml-1">
                    Daftar di sini
                </button>
            </div>
        </div>
    </div>
</template>
