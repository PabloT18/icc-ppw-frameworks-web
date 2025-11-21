import { ChangeDetectionStrategy, Component, EventEmitter, output, Output, signal, inject } from '@angular/core';
import { ProyectosService } from '../../../../proyecto-dos-page/proyectodospage/services/proyectos-service';
@Component({
  selector: 'add-proyecto',
  standalone: true,
  imports: [],
  templateUrl: './add-proyecto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProyecto {

  name = signal('');
  descripcion = signal('');

      
  newProyecto = output<Proyecto>();
  removeProyecto = output<number>();

 

  addProyecto() {
    const newProyecto: Proyecto = {
      id: Math.floor(Math.random() * 1000),
      nombre: this.name(),
      descripcion: this.descripcion(),
    };
    this.newProyecto.emit(newProyecto);
    this.name.set('');
    this.descripcion.set('');

      
  }
  dellProyecto(id: number) {
    this.removeProyecto.emit(id);
  }

  changeName(value: string) {
    this.name.set(value);
  }

  changeDescription(value: string) {
    this.descripcion.set(value);
  }
}
