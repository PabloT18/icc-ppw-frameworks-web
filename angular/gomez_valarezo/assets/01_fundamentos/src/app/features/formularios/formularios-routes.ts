import { Routes } from '@angular/router';

import { Formulario } from './pages/Formulariopage/formulario';
import { FormulariosDinamicosComponent } from './pages/formulariosdinamicos/formulariosdinamicos';

export const formulariosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic',
        title: 'Formularios Básicos',
        component: Formulario,
      },
      {
        path: 'dynamic',
        title: 'Formularios Dinámicos',
        component: FormulariosDinamicosComponent,
      },
      {
        path: 'more',
        title: 'Más Formularios',
        loadComponent: () => import('./pages/formulariosmorepage/formulariosmorepage').then(m => m.FormulariosMorePage)
      },
      {
        path: '**',
        redirectTo: 'basic',
      },
    ],
  },
];
