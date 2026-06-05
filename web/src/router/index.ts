import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import EstimatePage from '@/pages/EstimatePage.vue'
import TransactionsPage from '@/pages/TransactionsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/estimate', name: 'Estimate', component: EstimatePage },
    { path: '/transactions', name: 'Transactions', component: TransactionsPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
