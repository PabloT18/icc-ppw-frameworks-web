import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-perfilpage',
  templateUrl: './perfilpage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPage {

  name = signal('Jean Pierre');
  lastName = signal('Valarezo');
  age = signal(21);

  
  getFullName(): string {
    return `${this.name()} ${this.lastName()} con edad ${this.age()} años`;
  }


  changeData(): void {
    this.name.set('Ana');
    this.lastName.set('Gonzales');
    this.age.set(25);
  }


  changeAge(): void {
    this.age.set(18);
  }


  resetData(): void {
    this.name.set('Jean Pierre');
    this.lastName.set('Valarezo');
    this.age.set(21);
  }
}
