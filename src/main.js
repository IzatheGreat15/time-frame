import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Import the router configuration
import './assets/base.css' // Import the CSS entry file
import VueSelect from 'vue3-select'
import 'vue3-select/dist/vue3-select.css'

const app = createApp(App)

app.use(router) // Use the router
app.component('vue-select', VueSelect);
app.mount('#app')