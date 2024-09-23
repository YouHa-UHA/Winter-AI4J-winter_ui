import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
const app = createApp(App)
import './assets/styles/dark/css-vars.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
