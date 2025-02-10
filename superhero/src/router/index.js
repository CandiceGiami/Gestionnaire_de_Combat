import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

// Ajout de Pinia
import { createApp } from 'vue'
const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')

export default router
