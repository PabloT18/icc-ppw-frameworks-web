import { Routes } from '@angular/router';
import { Homepage } from './features/homepage/homepage';
import { PerfilPage } from './features/perfilpage/perfilpage';
import { ProyectosPage } from './features/proyectos-page/proyectopage/proyectopage';
import { ProyectoDosPage } from './features/proyecto-dos-page/proyectodospage/proyectodospage';
//import { Formulario } from './features/formulario/formulario';
// import { FormulariosDinamicos } from './features/formularios-dinamicos/formularios-dinamicos'; 






export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Homepage
  },
  {
    path: 'perfil',
    component: PerfilPage
  },
  {
    path: 'proyectos',
    component: ProyectosPage
  },
  { path: 'proyecto-dos', 
    component: ProyectoDosPage },
    // { path: 'formulario', component: Formulario },
  // { path: 'formulario-dinamico', component: FormulariosDinamicos },
     {
      
      path: 'formulario',
      loadChildren: () => import('./features/formularios/formularios-routes').then(m => m.formulariosRoutes)
    },
   
    {
      path: '**',
      redirectTo: ''
    }

];
