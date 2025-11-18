import { effect, Injectable, output, signal } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  

  constructor() {

    effect(() => {
      const data = this.proyectos();
      console.log(data);
      console.log(JSON.stringify(data));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    });
  }
  private readonly STORAGE_KEY = 'proyectosAPP';

  proyectos = signal<Proyecto[]>(this.loadProyectos());

  private loadProyectos() : Proyecto[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [{ 
      id: 1, nombre: 'Proyecto A', 
      descripcion: 'descripcion' 
    }];


  }

  
  
  addProyecto(newProyecto: Proyecto) {
    this.proyectos.set([...this.proyectos(), newProyecto]);
  }

  dellFirstProyecto() {
    this.proyectos.set(this.proyectos().slice(1)); 
  };
}
