<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import Swal from 'sweetalert2'
import router from '@/router'

const loading = ref(true)
const business = ref(null)
const activeApplication = ref(null)

const form = ref({
  jumlah_pembiayaan: '',
  tenor_bulan: 12,
  tujuan_pembiayaan: ''
})

const fetchInitialData = async () => {
    try {
        const [bizRes, appsRes] = await Promise.all([
            axios.get('/business-verifications'),
            axios.get('/financing-applications')
        ])

        if (bizRes.data.data.length > 0) {
            business.value = bizRes.data.data[0]
        }

        const apps = appsRes.data.data
        activeApplication.value = apps.find(a => 
            !['rejected_by_analyst', 'rejected_by_manager', 'draft'].includes(a.status)
        )
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const maxLimit = computed(() => {
    if (!business.value) return 0
    return business.value.omzet_bulanan * 3
})

const canApply = computed(() => {
    return business.value?.status === 'verified' && !activeApplication.value
})

const handleSubmit = async () => {
    if (form.value.jumlah_pembiayaan > maxLimit.value) {
        Swal.fire('Limit Terlampaui', `Maksimal pembiayaan adalah Rp ${maxLimit.value.toLocaleString('id-ID')} (3x omzet bulanan).`, 'warning')
        return
    }

    try {
        await axios.post('/financing-applications', form.value)
        Swal.fire('Berhasil', 'Pengajuan pembiayaan Anda telah dikirim.', 'success')
        router.push('/dashboard')
    } catch (err) {
        Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error')
    }
}

onMounted(fetchInitialData)
</script>

<template>
    <div class="p-6">
        <div v-if="loading" class="bg-white border rounded-lg p-10 text-center text-gray-500">
            Memuat data...
        </div>

        <div v-else class="max-w-2xl mx-auto">
            <div v-if="!business || business.status !== 'verified'" class="bg-white border rounded-lg p-10 text-center">
                


                <h3 class="text-lg font-bold text-[#0B132A]">Verifikasi Diperlukan</h3>
                <p class="text-sm text-slate-500 mt-2">
                    Anda harus memiliki Bisnis yang sudah Terverifikasi sebelum dapat mengajukan pembiayaan.
                </p>
                <button @click="router.push('/business')" class="mt-6 bg-[#F53838] text-white px-6 py-2 rounded font-bold text-sm">
                    Ke Halaman Verifikasi
                </button>
            </div>

            <div v-else-if="activeApplication" class="bg-white border rounded-lg p-10 text-center">
                
                <h3 class="text-lg font-bold text-[#0B132A]">Pengajuan Aktif</h3>
                <p class="text-sm text-slate-500 mt-2">
                    Anda sudah memiliki pengajuan proses
                </p>


                <button @click="router.push('/dashboard')" class="mt-6 border border-slate-200 text-slate-600 px-6 py-2 rounded font-bold text-sm">
                    Kembali ke Dashboard
                </button> 
            </div>

            <div v-else class="bg-white border rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b">
                    <h3 class="text-lg font-bold text-[#0B132A]">Form Pengajuan Pembiayaan</h3>







                </div>
                
                <div class="bg-blue-50 border-b border-blue-100 p-4">
                    <div class="text-xs font-bold text-blue-600 uppercase">Informasi Limit</div>
                    <div class="text-sm text-blue-800 mt-1">
                        Berdasarkan omzet bulanan kamu Rp {{ Number(business.omzet_bulanan).toLocaleString('id-ID') }}, 



                        maksimal pinjaman Rp {{ maxLimit.toLocaleString('id-ID') }}.
                    </div>
                </div>

                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <div>


                        <label class="block text-sm font-bold text-[#0B132A] mb-1">Jumlah Pembiayaan</label>
                        <input v-model="form.jumlah_pembiayaan" type="number" required :max="maxLimit" class="w-full border rounded px-3 py-2 text-sm" >
                    </div>

            <div>
                <label class="block text-sm font-bold text-[#0B132A] mb-1">Tenor Bulan</label>
                <select v-model="form.tenor_bulan" class="w-full border rounded px-3 py-2 text-sm">
                    <option :value="6">6 Bulan</option>
                    <option :value="12">12 Bulan</option>
                    <option :value="24">24 Bulan</option>
                </select>
            </div>

                    <div>
                        <label class="block text-sm font-bold text-[#0B132A] mb-1">Tujuan Pembiayaan</label>
                        <textarea v-model="form.tujuan_pembiayaan" required rows="3" class="w-full border rounded px-3 py-2 text-sm" ></textarea>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="w-full bg-[#F53838] text-white font-bold py-2 px-4 rounded ">
                            Kirim Pengajuan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
