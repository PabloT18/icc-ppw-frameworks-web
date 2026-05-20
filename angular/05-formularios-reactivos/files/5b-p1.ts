import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styles: ``
})
export default class ProfilePage {
  private fb = inject(FormBuilder);

  myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    edad: [0, [Validators.required, Validators.min(18)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  get nombre() { return this.myForm.get('nombre')!; }
  get edad() { return this.myForm.get('edad')!; }
  get correo() { return this.myForm.get('correo')!; }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Perfil guardado:', this.myForm.value);
  }
}