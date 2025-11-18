import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formulario { 
  onSubmit() {
    if (this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }
  
    console.log('Datos del Formulario',this.myForm.value);
    alert('Formulario enviado correctamente');
    this.myForm.reset();

  }

  isValidField(fieldName: string): boolean | null {
    return (
      this.myForm.controls[fieldName].errors 
      && this.myForm.controls[fieldName].touched
    );
  } 
  getFieldError(fieldName: string): string | null {
    if (!this.myForm.controls[fieldName].errors) return null;

    const errors = this.myForm.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
          
        case 'min':
          return `El valor mínimo es ${errors['min'].min}`;
        case 'email':
          return 'Formato de correo no válido';
      }
    }
    return null;
  }



  private fb = inject(FormBuilder);

  myForm: FormGroup = this.fb.group({
    nombre: ['',[Validators.required, Validators.minLength(3)]],
    edad: ['',[Validators.required, Validators.min(18)]],
    correo: ['',[Validators.required, Validators.email]],
  });


  formulario = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
  });

}
