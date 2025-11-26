import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Announcement from '../views/Announcement.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/announcement/:id',
    name: 'Announcement',
    component: Announcement
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
