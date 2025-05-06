import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { h } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/views/ProjectView.vue')
    },
    {
      path: '/project/:id',
      name: 'project-single',
      component: () => import('@/views/ProjectSingleView.vue')
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: h(
        'p',
        { style: 'text-align: center; font-size: 2rem;' },
        'Page not found'
      )
    }
  ]
})

export default router
