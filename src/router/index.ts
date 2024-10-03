import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from '../views/ChatPage.vue';
import ChatLogin from '../views/ChatLogin.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatPage
    },
    {
      path: '/login',
      name: 'ChatLogin',
      meta: { transition: 'slide' }, // 这里定义了只在这个路由上生效的动画
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
      component: () => import('../views/ChatLogin.vue')
    }
  ]
})

export default router
