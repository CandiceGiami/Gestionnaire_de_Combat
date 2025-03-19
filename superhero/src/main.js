import './assets/main.css'
import './assets/style.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

const app = createApp(App)

// Ajout de Pinia et du router 
app.use(createPinia())
app.use(router)
app.mount('#app')
