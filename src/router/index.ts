import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from '../views/ChatPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatPage
    },
    {
      path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
      redirect: '/',
    },
    {
      path: '/login',
      name: 'ChatLogin',
      meta: { transition: 'slide' }, // 这里定义了只在这个路由上生效的动画
      //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
      component: () => import('../views/ChatLogin.vue')
    }
  ]
})

export default router
