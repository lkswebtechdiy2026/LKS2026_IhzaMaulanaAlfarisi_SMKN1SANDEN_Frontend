import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import BusinessView from '../views/BusinessView.vue'
import BusinessListView from '../views/BusinessListView.vue'
import ApplicationFormView from '../views/ApplicationFormView.vue'
import MainLayout from '../components/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: '/business',
          name: 'business',
          component: BusinessView
        },
        {
          path: '/verifications',
          name: 'verifications',
          component: BusinessListView
        },
        {
          path: '/applications/new',
          name: 'application-form',
          component: ApplicationFormView
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  if (to.meta.requiresAuth && !isLoggedIn) {
     next('/login')
  } else if (to.meta.guestOnly && isLoggedIn) {
     next('/dashboard')
  } else {
     next()
  }
})

export default router
