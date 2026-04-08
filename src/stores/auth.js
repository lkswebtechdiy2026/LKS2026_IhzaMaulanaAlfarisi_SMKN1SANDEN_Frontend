import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import Swal from 'sweetalert2'

export const useAuthStore = defineStore('auth', {
    state: () => {
        const savedUser = localStorage.getItem('user')
        return {
            user: (savedUser && savedUser !== 'undefined') ? JSON.parse(savedUser) : null,
            token: localStorage.getItem('token') || null,
        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
        role: (state) => state.user?.role || null,
    },
    actions: {
        async login(credentials) {
            try {
                const response = await axios.post('/auth/login', credentials)
                this.token = response.data.data.token
                this.user = response.data.data.user
                
                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))
                
                return true
            } catch (err) {
                Swal.fire('Error', err.response?.data?.message || 'Login gagal', 'error')
                return false
            }
        },
        async register(userData) {
            try {
                const response = await axios.post('/auth/register', userData)
                this.token = response.data.data.token
                this.user = response.data.data.user
                
                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))
                
                Swal.fire('Success', 'Buat Akun berhasil', 'success')
                return true
            } catch (err) {
                Swal.fire('Error', err.response?.data?.message || 'Registration gagal', 'error')
                return false
            }


        },
        async logout() {
            try {
                await axios.post('/auth/logout')
            } catch (err) {
                console.error('Logout error:', err)
            } finally {
                this.token = null
                this.user = null
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
    }
})
