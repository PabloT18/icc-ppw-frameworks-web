# Programación y Plataformas Web

# Frameworks Web: Angular 21 + Firebase

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="80" alt="Firebase Logo">
</div>

## 09. Firebase y Autenticación

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo del tema

Incorporar autenticación y persistencia básica en la nube al proyecto incremental usando Firebase, de forma que el proyecto ya disponga de sesión real antes de implementar guards y despliegue.

---

## 2. Explicación conceptual

Firebase aporta un backend listo para usar en escenarios académicos y prototipos: autenticación, Firestore, reglas y hosting. En este curso interesa especialmente porque permite enseñar sesión, datos por usuario y persistencia sin construir backend propio en esta fase.

| Proyecto sin autenticación | Proyecto con Firebase |
|---|---|
| todas las acciones son anónimas | existen usuarios autenticados |
| no hay persistencia por usuario | se pueden guardar favoritos o registros personales |
| guards serían solo simulados | guards posteriores se apoyan en sesión real |

---

## 3. Fundamento técnico

### 3.1 AngularFire

```bash
pnpm add @angular/fire firebase
pnpm ng add @angular/fire
```

### 3.2 Servicios principales de Firebase para este curso

- Authentication
- Firestore

### 3.3 Configuración global

AngularFire se integra desde `app.config.ts` mediante providers. El detalle exacto depende del asistente de configuración, pero el criterio pedagógico es claro: centralizar la configuración y no dispersarla por componentes.

### 3.4 Seguridad mínima relevante

En este tema sí corresponde dejar una nota breve de seguridad, porque la solución propuesta puede mitigar fallas concretas:

- autenticar en frontend no sustituye reglas de Firestore
- las reglas deben impedir acceso anónimo a datos privados
- en desarrollo se pueden usar reglas amplias, pero deben marcarse explícitamente como temporales

---

## 4. Ejemplos de código

### Ejemplo 1: servicio de autenticación

```ts
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
```

### Ejemplo 2: persistencia por usuario

```ts
{
  userId: 'uid-123',
  characterId: 7,
  customName: 'Favorito',
}
```

---

## 5. Buenas prácticas

- Configura Firebase una sola vez en el proyecto.
- Mantén auth y acceso a datos encapsulados en servicios.
- Modela claramente qué datos pertenecen al usuario autenticado.
- No expongas reglas de desarrollo como si fueran seguras para producción.
- Introduce persistencia mínima útil antes de expandir funcionalidad.

---

## 6. Errores comunes

- Mezclar toda la lógica Firebase dentro de un componente.
- No documentar el flujo de autenticación del proyecto.
- Asumir que estar logueado ya implica tener permisos correctos.
- No separar favoritos o datos por usuario.
- Dejar reglas abiertas en Firestore sin advertencia explícita.

---

## 7. Relación con el proyecto incremental

Este módulo agrega sesión real al proyecto y permite guardar información asociada a cada usuario. Es el paso previo necesario para implementar guards y control de navegación con sentido práctico.

---

## 8. Referencias recomendadas

- Documentación oficial Firebase: https://firebase.google.com/docs
- [angular/docs/A-heuristicas.md](../docs/A-heuristicas.md)
