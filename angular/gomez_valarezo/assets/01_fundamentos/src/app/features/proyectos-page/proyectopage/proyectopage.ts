import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Proyecto{
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-proyectopage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectopage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosPage {
  
  name=signal('');
  descripcion=signal('');

  proyectos=signal<Proyecto[]>([
    {
      id: 1,nombre: 'Proyecta A',
      descripcion:'descripcion'
    }
  ])

  changeName(value: string){
    this.name.set(value);
  }
  changeDescription(value: string){
    this.descripcion.set(value);
  }
  addProyecto(nameVal?: string, descVal?: string){
    const nombre = (typeof nameVal === 'string' && nameVal.length > 0) ? nameVal : this.name();
    const descripcion = (typeof descVal === 'string' && descVal.length > 0) ? descVal : this.descripcion();

    const newProyecto: Proyecto = {
      id: this.proyectos().length + 1,
      nombre,
      descripcion
    };

    this.proyectos.set([...this.proyectos(), newProyecto]);
   
    this.name.set('');
    this.descripcion.set('');
  }
 }