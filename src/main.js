import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Import the router configuration
import './assets/base.css' // Import the CSS entry file

const app = createApp(App)

app.use(router) // Use the router

app.mount('#app')