// 1. AÑADIDO: Importa FormArray
import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {

  static emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
 

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);
  }

  static getTextError(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return 'El valor ingresado no es un correo electrónico válido';

        case 'emailTaken':
          return 'El correo ya está siendo utilizado';

        case 'invalidName':
          return 'El nombre no puede ser ocupado';

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) { 
            return 'El formato del correo electrónico es incorrecto';
          }
          return 'Error de patrón (expresión regular)';

        default:
          return 'Error de validación no controlado';
      }
    }
    
    
    return null;
  } 


  static isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
    return (
      !!formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
   
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};
    return FormUtils.getTextError(errors);
  }
}
