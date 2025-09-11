import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './static/font/font.css'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) 
export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia)
  return {
    app,
  };
}
