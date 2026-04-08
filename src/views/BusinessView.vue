<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import Swal from 'sweetalert2'
import StatusTimeline from '@/components/StatusTimeline.vue'

const loading = ref(true)
const businessData = ref(null)
const form = ref({
  nama_usaha: '',
  nib: '',
  npwp: '',
  omzet_bulanan: '',
  jumlah_karyawan: '',
  lama_usaha_tahun: ''
})

const fetchBusiness = async () => {
  try {
    const { data } = await axios.get('/business-verifications')
    if (data.data.length > 0) {
      businessData.value = data.data[0]
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    const { data } = await axios.post('/business-verifications', form.value)
    Swal.fire('Berhasil', 'Data usaha berhasil dikirim untuk verifikasi.', 'success')
    businessData.value = data.data
  } catch (error) {
    Swal.fire('Gagal', error.response?.data?.message || 'Gagal mengirim data.', 'error')
  }
}

onMounted(fetchBusiness)
</script>

<template>
  <div class="p-6">
    <div v-if="loading" class="bg-white border rounded-lg p-10 text-center text-gray-500">
      Memuat data...
    </div>

    <div v-else>
      <div v-if="!businessData" class="max-w-2xl mx-auto bg-white border rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-bold text-[#0B132A]">Form Verifikasi Usaha</h3>
        </div>
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-[#0B132A] mb-1">Nama Usaha</label>
              <input v-model="form.nama_usaha" type="text" required class="w-full border rounded px-3 py-2 text-sm ">
            </div>
            <div>
              <label class="block text-sm font-bold text-[#0B132A] mb-1">NIB</label>
              <input v-model="form.nib" type="text" required class="w-full border rounded px-3 py-2 text-sm " placeholder="Nomor Induusaha">
            </div>
            <div>
              <label class="block text-sm font-bold text-[#0B132A] mb-1">NPWP</label>
              <input v-model="form.npwp" type="text" required class="w-full border rounded px-3 py-2 text-sm " placeholder="00.000.000.0-000.000">
            </div>
            <div>
              <label class="block text-sm font-bold text-[#0B132A] mb-1">Omzet Bulanan (Rp)</label>
              <input v-model="form.omzet_bulanan" type="number" required class="w-full border rounded px-3 py-2 text-sm ">
            </div>
            <div>
              <label class="block text-sm font-bold text-[#0B132A] mb-1">Jumlah Karyawan</label>
              <input v-model="form.jumlah_karyawan" type="number" required class="w-full border rounded px-3 py-2 text-sm ">
            </div>
            <div>
              <label class="block text-sm font-bold text-[#0B132A] mb-1">Lama Usaha (Tahun)</label>
              <input v-model="form.lama_usaha_tahun" type="number" required class="w-full border rounded px-3 py-2 text-sm ">
            </div>
          </div>
          <div class="pt-4">
            <button type="submit" class="w-full bg-[#F53838] text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors">
              Ajukan Verifikasi
            </button>
          </div>
        </form>
      </div>

      <div v-else class="max-w-2xl mx-auto bg-white border rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-bold text-[#0B132A]">Status Verifikasi Usaha</h3>
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
            <StatusTimeline :status="businessData.status" />
          </div>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">Nama Usaha</div>
            <div class="text-sm font-bold text-[#0B132A]">{{ businessData.nama_usaha }}</div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">NIB / NPWP</div>
            <div class="text-sm font-bold text-[#0B132A]">{{ businessData.nib }} / {{ businessData.npwp }}</div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">Omzet Bulanan</div>
            <div class="text-sm font-bold text-[#0B132A]">Rp {{ Number(businessData.omzet_bulanan).toLocaleString('id-ID') }}</div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">Lama Usaha</div>
            <div class="text-sm font-bold text-[#0B132A]">{{ businessData.lama_usaha_tahun }} Tahun</div>
          </div>
        </div>
        <div v-if="businessData.status === 'rejected'" class="mx-6 mb-6 p-4 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
           <strong>Alasan Penolakan:</strong> {{ businessData.rejected_reason || 'Tidak ada alasan spesifik.' }}
        </div>
      </div>
    </div>
  </div>
</template>
