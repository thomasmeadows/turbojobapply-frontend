import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './assets/styles/fonts.css';
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Set up axios interceptor for automatic token refresh
const authStore = useAuthStore();
authStore.setupAxiosInterceptor();

app.mount('#app');
