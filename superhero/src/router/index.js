import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: "/heroes",
      name: "HeroLibrary",
      component: () => import("@/views/HeroLibrary.vue"),
    },
    {
      path: "/history",
      name: "History",
      component: () => import("@/views/HistoryView.vue"),
    }
  ],
})

// Initialisation Vue + Pinia
import { createApp } from 'vue'
const app = createApp(App)
app.use(createPinia())
app.use(router)

// Évite le problème de double mount
if (!app._container) {
  app.mount('#app')
}

export default router
