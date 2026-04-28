# Programación y Plataformas Web

# Frameworks Web: Angular 21 + Firebase

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" width="80" alt="Firebase Logo">
</div>

## 09. Firebase y Autenticación - Práctica

### Autor

**Pablo Torres**  
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)  
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

## 1. Objetivo práctico

Integrar Firebase Authentication y Firestore al proyecto `ppw-angular-21` para permitir login, logout y persistencia básica de favoritos o registros por usuario.

---

## 2. Contexto de la práctica

La aplicación ya consume datos remotos y tiene una UX razonable. Ahora se añadirá identidad de usuario. El objetivo no es construir toda una plataforma de usuarios, sino dejar la sesión lista para que el módulo siguiente aplique guards reales.

---

## 3. Archivos que se van a modificar

- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/app/features/auth/pages/login-page.ts`
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/favorites.service.ts`

---

## 4. Archivos base desde `files`

La carpeta [angular/09-firebase-autenticacion/files](files/README.md) queda lista para almacenar la configuración base de Firebase, auth service y los servicios de persistencia mínimos del módulo.

---

## 5. Código que el estudiante debe copiar inicialmente

### 5.1 Instalar dependencias

```bash
pnpm add @angular/fire firebase
pnpm ng add @angular/fire
```

### 5.2 Ruta inicial de login

```ts
{ path: 'login', component: LoginPage }
```

---

## 6. Pasos incrementales

### Paso 1. Configurar Firebase en el proyecto

Ejecutar el asistente y registrar Authentication y Firestore.

Explicación técnica: esta configuración debe quedar centralizada para que auth y persistencia no dependan de hacks locales.

### Paso 2. Crear `AuthService`

Encapsular login, logout y estado de sesión.

Explicación técnica: el resto del proyecto debe depender de un servicio de auth, no de llamadas sueltas a Firebase.

### Paso 3. Crear `LoginPage`

Construir una pantalla mínima con formulario reactivo para email y password.

Explicación técnica: se reutiliza el enfoque de formularios ya aprendido, ahora en un flujo de autenticación real.

### Paso 4. Mostrar estado de sesión en el navbar

Actualizar el shell para mostrar acciones diferentes según exista usuario autenticado.

Explicación técnica: el estado de auth ya empieza a afectar navegación y experiencia global.

### Paso 5. Crear persistencia de favoritos

Guardar en Firestore un subconjunto de personajes favoritos asociado al usuario autenticado.

Explicación técnica: se enseña a persistir datos propios del usuario, no solo a iniciar sesión.

### Paso 6. Verificar reglas mínimas de Firestore

Confirmar que solo usuarios autenticados pueden leer o escribir los datos del módulo.

Explicación técnica: este paso conecta autenticación con seguridad real de datos.

---

## 7. Validaciones esperadas

- El usuario puede iniciar y cerrar sesión.
- El estado de sesión se refleja en la interfaz.
- Los favoritos o registros del usuario se guardan en Firestore.
- La aplicación no deja esas acciones a usuarios anónimos.

Placeholder sugerido de captura: `assets/09-login-firebase.png`

---

## 8. Entregables

- Firebase configurado en el proyecto.
- Login y logout funcionales.
- Persistencia mínima por usuario en Firestore.
- Navbar o shell actualizado según autenticación.

---

## 9. Commits sugeridos

```bash
git commit -m "feat: integrar firebase auth y firestore"
git commit -m "feat: agregar login page y auth service"
git commit -m "feat: persistir favoritos por usuario"
```
