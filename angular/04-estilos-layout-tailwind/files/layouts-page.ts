import { Component } from '@angular/core';

type LayoutCard = {
  meta: string;
  title: string;
  description: string;
};

type LayoutSection = {
  title: string;
  description: string;
  containerClass: string;
  cardClass: string;
  cards: LayoutCard[];
};

@Component({
  selector: 'app-layouts-page',
  standalone: true,
  templateUrl: './layouts-page.html',
})
export class LayoutsPage {
  readonly layoutSections: LayoutSection[] = [
    {
      title: 'Dashboard con sidebar',
      description: 'Layout clásico para paneles administrativos con una columna fija y contenido principal flexible.',
      containerClass: 'grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]',
      cardClass: 'rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200',
      cards: [
        {
          meta: 'Sidebar',
          title: 'Menú principal',
          description: 'Agrupa accesos a secciones internas sin competir visualmente con el contenido central.',
        },
        {
          meta: 'Contenido',
          title: 'Panel central',
          description: 'Ocupa el espacio disponible con títulos, métricas y acciones prioritarias.',
        },
      ],
    },
    {
      title: 'Grid de métricas',
      description: 'Ideal para dashboards compactos donde cada card muestra un indicador distinto.',
      containerClass: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4',
      cardClass: 'rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200',
      cards: [
        { meta: 'Card 01', title: 'Usuarios activos', description: 'Indicador rápido de actividad del sistema.' },
        { meta: 'Card 02', title: 'Tareas pendientes', description: 'Resumen visual de trabajo por completar.' },
        { meta: 'Card 03', title: 'Ingresos', description: 'Métrica financiera con lectura inmediata.' },
        { meta: 'Card 04', title: 'Satisfacción', description: 'Valor agregado para seguimiento de experiencia.' },
      ],
    },
    {
      title: 'Hero + aside',
      description: 'Composición útil para páginas de aterrizaje o detalle editorial con foco visual claro.',
      containerClass: 'grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]',
      cardClass: 'rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200',
      cards: [
        { meta: 'Hero', title: 'Bloque principal', description: 'Aquí vive el mensaje central o la llamada a la acción.' },
        { meta: 'Aside', title: 'Apoyo contextual', description: 'Sirve para información auxiliar, enlaces o datos secundarios.' },
      ],
    },
    {
      title: 'Carrusel horizontal de cards',
      description: 'Cuando el contenido necesita desplazamiento lateral en pantallas pequeñas y lectura continua.',
      containerClass: 'flex gap-4 overflow-x-auto pb-2',
      cardClass: 'min-w-[18rem] shrink-0 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200',
      cards: [
        { meta: 'Card A', title: 'Primer elemento', description: 'La fila puede desplazarse sin romper el layout global.' },
        { meta: 'Card B', title: 'Segundo elemento', description: 'Se mantiene estable y usable en móviles.' },
        { meta: 'Card C', title: 'Tercer elemento', description: 'Cada card conserva una jerarquía visual consistente.' },
      ],
    },
  ];
}
