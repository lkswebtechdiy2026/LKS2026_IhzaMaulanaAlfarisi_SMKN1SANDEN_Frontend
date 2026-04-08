<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    name: '',
    email: '',
    password: '',
    role: 'applicant'
})

const handleRegister = async () => {
    const success = await authStore.register(form.value)
    if (success) {
        router.push('/dashboard')
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
        <div class="bg-white p-10 rounded-[10px] border border-black w-full max-w-[500px]">
            <div class="text-center mb-8">
                <div class="flex items-center justify-center gap-2.5 mb-6">
                    <span class="text-2xl font-bold text-[#0B132A]">PT FA UMKM</span>
                </div>
                <h2 class="text-[28px] font-medium text-[#0B132A] mb-2">Daftar Akun Baru</h2>
                <p class="text-[#4F5665]">Lengkapi data di sini untuk bergabung dengan kami.</p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-5">
                <div>
                    <label class="block text-[#0B132A] text-sm font-medium mb-2">Nama Lengkap</label>
                    <input 
                        v-model="form.name" 
                        type="text" 
                        required 
                        class="w-full px-4 py-3 border border-gray-200 rounded-md text-[#4F5665] placeholder-gray-400 "
                        placeholder="Masukkan nama lengkap"
                    >
                </div>

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
                        placeholder="Buat password (min 8 kataa)"
                    >
                </div>

                <div>
                  
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-[#F53838] text-white font-bold py-3.5 px-4 rounded-md hover:bg-[#D93030] transition-colors"
                >
                    Daftar Sekarang
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-[#4F5665]">
                Sudah punya akun? 
                <button type="button" @click="router.push('/login')" class="text-[#F53838] font-medium hover:underline ml-1">
                    Login di sini
                </button>
            </div>
        </div>
    </div>
</template>
