import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoProyectos } from '../proyectos-page/proyectopage/components/listado-proyectos/listado-proyectos';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Homepage implements OnInit{
  
  ngOnInit(): void {
        this.startAutomaticSignalIncrement();
    }

    startAutomaticSignalIncrement(): void {
        setInterval(() => {
            this.counterSignal.update(current => current + 1);
        }, 1000); 
    }

  counter = 0;
  counterSignal = signal(0);

  changeValude(value: number) {
    this.counter += value;
    
  }

  resetValue(value: number) {
    this.counter = value;
    this.counterSignal.set(value);
  }
}