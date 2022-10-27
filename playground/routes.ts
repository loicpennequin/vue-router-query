import { todoDetailsLoader } from './loaders/todoDetailsLoader';
import { homeLoader } from './loaders/homeLoader';

export const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('./pages/Home.vue'),
    meta: {
      loader: homeLoader
    }
  },
  {
    name: 'TodoDetails',
    path: '/todo/:id',
    component: () => import('./pages/TodoDetails.vue'),
    meta: { loader: todoDetailsLoader }
  }
];
