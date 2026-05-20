import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador custom que compara dos campos: password y confirmPassword.
 * Se aplica al nivel de FormGroup, no a un control individual.
 * 
 * Retorna:
 * - null si las contraseñas coinciden (validación exitosa)
 * - { passwordMismatch: true } si no coinciden
 */
export function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');

  // Si los controles no existen, no validar
  if (!password || !confirmPassword) {
    return null;
  }

  // Si alguno está vacío, no validar (otros validadores (required) se encargarán)
  if (!password.value || !confirmPassword.value) {
    return null;
  }

  // Comparar valores
  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
}
