import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from '../views/ChatPage.vue';
import ChatHome from '../views/ChatHome.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatHome
    },
    {
      path: '/chat',
      name: 'chatPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
      component: () => import('../views/ChatPage.vue')
    }
  ]
})

export default router
