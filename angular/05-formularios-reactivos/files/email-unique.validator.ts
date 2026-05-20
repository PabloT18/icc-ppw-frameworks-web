import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';
/**
 * Validador async que simula una verificación de email único.
 * En una aplicación real, esto sería una llamada HTTP a `GET /api/email-check/:email`.
 * 
 * Mientras valida, el control entra en estado PENDING.
 * Retorna:
 * - null si el email está disponible
 * - { emailTaken: true } si el email ya existe
 */

export function emailUniqueValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Si el campo está vacío, no se valida disponibilidad
    if (!control.value) {
      return of(null);
    }

    // Convierte el valor actual del control en un Observable
    return of(control.value).pipe(
      // Simula el tiempo de respuesta de una API
      delay(500),

      // Transforma el email en un resultado de validación
      map((email: string) => {
        const takenEmails = [
          'user@example.com',
          'admin@example.com',
          'test@example.com',
        ];

        // Si existe, devuelve error; si no existe, devuelve null
        return takenEmails.includes(email.toLowerCase())
          ? { emailTaken: true }
          : null;
      })
    );
  };
}