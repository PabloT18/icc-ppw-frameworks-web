import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/formutils/formutils';
import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-formulariosmorepage',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulariosmorepage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormulariosMorePage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    genero: ['M', [Validators.required]],
    notificaciones: [true, [Validators.required]],
    condiciones: [false, [Validators.requiredTrue]],
  });

  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) return;

    console.log('Datos enviados:', this.myForm.value);
    alert('Formulario válido. Datos registrados correctamente.');
  }
}
