import 'uno.css';
import '@unocss/reset/tailwind.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { VueQueryPlugin } from 'vue-query';
import App from './App.vue';
import { routes } from './routes';

createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes
    })
  )
  .use(VueQueryPlugin)
  .mount('#app');
