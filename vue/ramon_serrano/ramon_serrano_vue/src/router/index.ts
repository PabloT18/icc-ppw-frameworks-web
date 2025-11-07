import { createRouter, createWebHistory } from 'vue-router'

// Importa las páginas
import HomePage from '../views/HomePage.vue'
import PerfilPage from '../views/PerfilPage.vue'
import Perfil2Page from '../views/Perfil2Page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/perfil', component: PerfilPage },
    { path: '/perfil2', component: Perfil2Page },
  ],
})

export default router
