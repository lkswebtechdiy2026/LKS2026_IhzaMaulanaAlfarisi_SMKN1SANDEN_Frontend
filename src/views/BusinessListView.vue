<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import Swal from 'sweetalert2'
import StatusTimeline from '@/components/StatusTimeline.vue'

const loading = ref(true)
const verifications = ref([])

const fetchVerifications = async () => {
    try {
        const { data } = await axios.get('/business-verifications')
        verifications.value = data.data
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const handleApprove = async (id) => {
    try {
        const result = await Swal.fire({
            title: 'Konfirmasi',
            text: "Setujui verifikasi usaha ini?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Setujui',
            confirmButtonColor: '#F53838'
        })

        if (result.isConfirmed) {
            await axios.patch(`/business-verifications/${id}/approve`, { status: 'verified' })
            Swal.fire('Berhasil', 'Usaha telah diverifikasi.', 'success')
            fetchVerifications()
        }
    } catch (err) {
        Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error')
    }
}

const handleReject = async (id) => {
    try {
        const { value: reason } = await Swal.fire({
            title: 'Tolak Verifikasi',
            input: 'textarea',
            inputLabel: 'Alasan Penolakan',
            inputPlaceholder: 'Masukkan alasan...',
            inputAttributes: { 'aria-label': 'Masukkan alasan' },
            showCancelButton: true,
            confirmButtonColor: '#F53838'
        })

        if (reason) {
            await axios.patch(`/business-verifications/${id}/approve`, { 
                status: 'rejected',
                rejected_reason: reason
            })
            Swal.fire('Berhasil', 'Verifikasi ditolak.', 'success')
            fetchVerifications()
        }
    } catch (err) {
        Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error')
    }
}

onMounted(fetchVerifications)
</script>

<template>
    <div class="p-6">
        <div class="bg-white border rounded-lg">
            <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-bold text-[#0B132A]">Daftar Verifikasi Bisnis</h3>
            </div>

            <div class="p-6">
                <div v-if="loading" class="text-center py-4 text-gray-500">Memuat data...</div>
                <div v-else-if="verifications.length === 0" class="text-center py-4 text-gray-500">Tidak ada data verifikasi.</div>
                <div v-else class="overflow-x-auto">
                    <table class="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr class=" text-gray-400 font-bold">
                                <th class="px-4 py-3 ">UMKM / Nama Usaha</th>
                                <th class="px-4 py-3 ">NIB / NPWP</th>
                                <th class="px-4 py-3  text-right">Omzet Bulanan</th>
                                <th class="px-4 py-3  text-center">Status</th>
                                
                                <th class="px-4 py-3  text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in verifications" :key="item.id" class="border-b last:border-0 ">
                                <td class="px-4 py-4 font-bold text-[#0B132A]">{{ item.nama_usaha }}</td>
                                <td class="px-4 py-4 text-gray-500">{{ item.nib }} <br> {{ item.npwp }}</td>
                                <td class="px-4 py-4 text-right font-bold">Rp {{ Number(item.omzet_bulanan).toLocaleString('id-ID') }}</td>
                                <td class="px-4 py-4 text-center">
                                    <StatusTimeline :status="item.status" />
                                </td>



                                <td class="px-4 py-4 text-right">
                                    <div v-if="item.status === 'submitted'" class="flex justify-end gap-2">
                                        <button @click="handleApprove(item.id)" class="bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase">Approve</button>
                                        <button @click="handleReject(item.id)" class="bg-[#F53838] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase">Reject</button>
                                    </div>
                                    <div v-else class="text-gray-300 text-[10px] uppercase font-bold">Closed</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
