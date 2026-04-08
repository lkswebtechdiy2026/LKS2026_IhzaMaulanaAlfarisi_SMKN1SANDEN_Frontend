<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router' 
import axios from '@/plugins/axios'
import StatusTimeline from '@/components/StatusTimeline.vue' 

const authStore = useAuthStore()
const router = useRouter() 
const loading = ref(true)
const totalSisaTagihan = ref(0)

const stats = ref({
  business: 0,
  totalLoans: 0,
  needOfficerReview: 0,
  needManagerApproval: 0,
  inProcess: 0,
  approvedCount: 0,
  rejectedCount: 0
})

const recentActivities = ref([]) 

const fetchStatusData = async () => {
  try {
    const appsRes = await axios.get('/financing-applications')
    const loans = appsRes.data.data

    if (authStore.role === 'applicant') {
      const bizRes = await axios.get('/business-verifications')
      const biz = bizRes.data.data
      stats.value.business = biz ? 1 : 0
      
      const approvedLoan = loans.find(l => l.status === 'approved')
      if (approvedLoan) {
        try {
          const instRes = await axios.get(`/financing-applications/${approvedLoan.id}/installments`)
          const installments = instRes.data.data
          totalSisaTagihan.value = installments
            .filter(i => i.status === 'unpaid')
            .reduce((acc, curr) => acc + Number(curr.total_cicilan), 0)
        } catch (e) {
          console.error(e)
        }
      }
    }

    stats.value.totalLoans = loans.length
    stats.value.needOfficerReview = loans.filter(l => ['submitted', 'under_review'].includes(l.status)).length
    stats.value.needManagerApproval = loans.filter(l => l.status === 'recommended').length
    stats.value.inProcess = loans.filter(l => !['approved', 'rejected_by_analyst', 'rejected_by_manager', 'draft'].includes(l.status)).length
    stats.value.approvedCount = loans.filter(l => l.status === 'approved').length
    stats.value.rejectedCount = loans.filter(l => l.status.includes('rejected')).length

    recentActivities.value = loans
      .filter(l => l.status !== 'draft')
      .map(l => ({
        ...l,
        amount: l.jumlah_pembiayaan,
        business_name: l.business_verification?.nama_usaha || 'Bisnis Anda'
      }))
      .reverse() 
      .slice(0, 5) 

    if (authStore.role !== 'applicant') {
      const bizAllRes = await axios.get('/business-verifications')
      const bizAll = bizAllRes.data.data
      stats.value.business = bizAll.length
      
      if (authStore.role === 'verifier') {
        stats.value.needOfficerReview = bizAll.filter(b => b.status === 'submitted').length
      }
    }
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getActivityText = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'submitted') return 'menunggu verifikasi data.'
  if (s === 'under_review') return 'sedang dalam proses analisis.'
  if (s === 'recommended') return 'direkomendasikan menunggu approval manager.'
  if (s === 'approved') return 'telah disetujui jadwal cicilan telah dibuat.'
  if (s.includes('rejected')) return 'telah ditolak.'
  return 'diperbarui.'
}

onMounted(fetchStatusData)
</script>

<template>
  <div v-if="loading" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
    <div  class=" rounded-lg border bg-white p-6 " witdh="100%"></div>
  </div>
  
  <div v-else class="space-y-6">
    <div class="bg-white border rounded-lg p-6">
        <h2 class="text-xl font-bold text-[#0B132A] mb-1">Selamat datang, {{ authStore.user?.name }}!</h2>
        <p class="text-slate-500 capitalize">Role Akun: <span class="font-bold text-[#F53838]">{{ authStore.role }}</span></p>
        <h2 v-if="authStore.role === 'applicant'" class="text-slate-500 mt-2">Total Sisa Tagihan : <span class="font-bold text-[#F53838]">Rp {{ totalSisaTagihan.toLocaleString('id-ID') }}</span></h2>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="border rounded-lg bg-white p-6">
        <div class="mt-2">
          <span class="text-xs font-bold text-[#4F5665] uppercase">
            {{ 
              authStore.role === 'applicant' ? 'Status Usaha' : 
              (authStore.role === 'verifier' ? 'Antrean Verifikasi' : 
              (authStore.role === 'analyst' ? 'Antrean Analisis' : 'Antrean Manager')) 
            }}
          </span>
          <h4 class="text-3xl font-bold text-[#0B132A] mt-1">
            {{ 
              authStore.role === 'applicant' ? (stats.business ? 'Aktif' : 'Belum Ada') : 
              (authStore.role === 'verifier' ? stats.needOfficerReview : 
              (authStore.role === 'analyst' ? stats.needOfficerReview : stats.needManagerApproval)) 
            }}
          </h4>
        </div>
      </div>

      <div class="border rounded-lg bg-white p-6">
        <div class="mt-2">
          <span class="text-xs font-bold text-[#4F5665] uppercase">
            {{ authStore.role === 'applicant' ? 'Sedang Diproses' : 'Total Pengajuan' }}
          </span>
          <h4 class="text-3xl font-bold text-[#0B132A] mt-1">
             {{ authStore.role === 'applicant' ? stats.inProcess : stats.totalLoans }}
          </h4>
        </div>
      </div>

      <div class="border rounded-lg bg-white p-6">
        <div class="mt-2">
          <span class="text-xs font-bold text-[#4F5665] uppercase">
            {{ authStore.role === 'applicant' ? 'Disetujui' : 'Total Unit UMKM' }}
          </span>
          <h4 class="text-3xl font-bold text-[#0B132A] mt-1">
             {{ authStore.role === 'applicant' ? stats.approvedCount : stats.business }}
          </h4>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded-lg">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-bold text-[#0B132A]">Status Pengajuan Terbaru</h3>
      </div>
      
      <div class="p-6">
        <div v-if="recentActivities.length === 0" class="text-center text-gray-400 py-6">
          Belum ada aktivitas terbaru yang tersedia.
        </div>
        
        <div v-else class="space-y-6">
          <div v-for="(activity, index) in recentActivities" :key="index" class="border-b last:border-0 pb-6 last:pb-0">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 class="text-base font-bold text-[#0B132A]">
                  Pembiayaan Rp {{ Number(activity.amount).toLocaleString('id-ID') }}
                </h4>
                <p class="text-sm text-slate-500 mt-1">
                  Unit Usaha: <span class="font-bold">{{ activity.business_name || 'Tidak diketahui' }}</span> 
                  - {{ getActivityText(activity.status) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
                <StatusTimeline :status="activity.status" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
