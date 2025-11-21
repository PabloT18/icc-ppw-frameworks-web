import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProyectosService } from './services/proyectos-service';
import { ListadoProyectos } from "../../proyectos-page/proyectopage/components/listado-proyectos/listado-proyectos";
import { AddProyecto } from "../../proyectos-page/proyectopage/components/add-proyecto/add-proyecto";

@Component({
  selector: 'app-proyecto-dos-page',
  standalone: true,
  imports: [ListadoProyectos, AddProyecto],
  templateUrl: './proyectodospage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoDosPage {
  proyectosService = inject(ProyectosService);
  
}

