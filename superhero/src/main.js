import './assets/main.css'
import './assets/style.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
