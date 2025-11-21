 Programación y Plataformas Web 

# Frameworks Web: Angular con tailwind

### ANGULAR

<div align="center">
  <img src="capturas/logo-framework-angular.png" width="80" alt="Angular Logo">
</div>

### TAILWIND CSS

<div align="center">
  <img src="capturas/tailwind-icon.png" width="80" alt="Angular Logo">
</div>

## Práctica 2: Heuristica y Manejo de estilos 

### Autor

**Rafael Prieto**  
📧 pprietos@est.ups.edu.ec  
💻 GitHub: [raet0](https://github.com/raet0)

---
## 🎯 ¿Qué son las Heurísticas de Usabilidad?

Las **heurísticas de usabilidad** son principios generales de diseño que describen las propiedades comunes de las interfaces de usuario útiles. Desarrolladas por Jakob Nielsen y Rolf Molich en 1990, estas reglas o "reglas de oro" permiten evaluar y mejorar la experiencia del usuario en sistemas digitales.

### 📈 Contexto Histórico

En los años 90, con el crecimiento de las interfaces gráficas y la computación personal, surgió la necesidad de establecer criterios objetivos para evaluar la calidad de los diseños de interfaz. Nielsen y Molich identificaron patrones recurrentes en interfaces exitosas y los sistematizaron en 10 principios fundamentales.

### 🎨 Importancia en Interfaces Gráficas

Las heurísticas son cruciales porque:
- **Reducen el costo de desarrollo** al identificar problemas temprano
- **Mejoran la satisfacción del usuario** con interfaces más intuitivas
- **Establecen un lenguaje común** entre diseñadores y desarrolladores
- **Proporcionan criterios objetivos** para tomar decisiones de diseño

---

## 🎨 UI vs UX: Conceptos Fundamentales

### 🖼️ **UI (User Interface) - Interfaz de Usuario**

La **UI** se refiere a los elementos visuales e interactivos con los que el usuario interactúa directamente:

- **Elementos visuales**: Botones, menús, iconos, tipografía, colores
- **Componentes interactivos**: Formularios, navegación, animaciones
- **Diseño visual**: Layout, espaciado, jerarquía visual

### 🧠 **UX (User Experience) - Experiencia de Usuario**

La **UX** abarca toda la experiencia que tiene una persona al usar un producto:

- **Investigación del usuario**: Necesidades, comportamientos, objetivos
- **Arquitectura de información**: Organización y estructura del contenido
- **Flujos de usuario**: Cómo navega y completa tareas
- **Usabilidad**: Facilidad de uso y eficiencia

### 🤝 **Cómo las Heurísticas Conectan UI y UX**

| UI (Lo Visual) | Heurística | UX (La Experiencia) |
|----------------|------------|---------------------|
| Botones claros, mensajes de error | Visibilidad del estado | Usuario sabe qué está pasando |
| Iconos universales, terminología familiar | Coincidencia con el mundo real | Navegación intuitiva |
| Atajos de teclado, breadcrumbs | Control y libertad del usuario | Sensación de control |
| Diseño consistente, patrones uniformes | Consistencia y estándares | Curva de aprendizaje reducida |

---

## 🔟 Las 10 Heurísticas de Nielsen: Guía Completa

![captura pagina 1](capturas/pag1-visibilidad.png)
### 1. 👁️ Visibilidad del Estado del Sistema

#### 📖 **Concepto**
El sistema debe mantener a los usuarios informados sobre lo que está sucediendo, proporcionando retroalimentación apropiada dentro de un tiempo razonable.

#### 🎯 **Ejemplo de Aplicación**
Una barra de progreso durante la carga de un archivo, indicadores de "en línea/desconectado" en aplicaciones de chat, o estados de "guardando..." en editores de texto.

#### 💡 **Consejos para Mejorar**
- Usa indicadores visuales claros (spinners, barras de progreso)
- Proporciona feedback inmediato para acciones del usuario
- Implementa estados de carga y mensajes informativos
- Utiliza animaciones suaves para transiciones

#### ❌ **Ejemplo Mal Aplicado**
```html
<!-- Sin feedback visual -->
<button onclick="submitForm()">Enviar</button>
```
**Problema**: El usuario no sabe si el formulario se está enviando o si debe hacer clic nuevamente.

#### ✅ **Ejemplo Bien Aplicado**
```html
<!-- Con feedback visual claro -->
<button id="submitBtn" onclick="submitForm()">
  <span id="btnText">Enviar</span>
  <span id="spinner" class="hidden">⏳ Enviando...</span>
</button>

<script>
function submitForm() {
  document.getElementById('btnText').classList.add('hidden');
  document.getElementById('spinner').classList.remove('hidden');
  document.getElementById('submitBtn').disabled = true;
}
</script>
```

---
![captura pagina 2](capturas/pag2-mundoreal.png)
### 2. 🌍 Correspondencia entre el Sistema y el Mundo Real

#### 📖 **Concepto**
El sistema debe hablar el idioma del usuario, usando palabras, frases y conceptos familiares para el usuario, siguiendo las convenciones del mundo real.

#### 🎯 **Ejemplo de Aplicación**
Usar iconos de "carpeta" para directorios, "papelera" para eliminar, o términos como "carrito de compras" en e-commerce.

#### 💡 **Consejos para Mejorar**
- Utiliza metáforas del mundo real (carpetas, archivos, escritorio)
- Emplea terminología familiar para tu audiencia específica
- Organiza la información de forma lógica y natural
- Usa iconos universalmente reconocidos

#### ❌ **Ejemplo Mal Aplicado**
```html
<!-- Terminología técnica confusa -->
<button>Ejecutar proceso de persistencia de datos</button>
<menu>
  <item>Configurar parámetros del sistema</item>
  <item>Inicializar módulos de autenticación</item>
</menu>
```
**Problema**: Lenguaje técnico que confunde a usuarios no técnicos.

#### ✅ **Ejemplo Bien Aplicado**
```html
<!-- Lenguaje natural y familiar -->
<button>💾 Guardar</button>
<menu>
  <item>⚙️ Configuración</item>
  <item>🔐 Iniciar Sesión</item>
</menu>
```

---
![captura pagina 3](capturas/pag3-control.png)
### 3. 🎮 Control y Libertad del Usuario

#### 📖 **Concepto**
Los usuarios necesitan sentir que controlan el sistema. Necesitan una "salida de emergencia" claramente marcada para salir de estados no deseados sin tener que pasar por diálogos extensos.

#### 🎯 **Ejemplo de Aplicación**
Funciones de deshacer/rehacer, botones de cancelar, breadcrumbs de navegación, o la opción de cerrar modales fácilmente.

#### 💡 **Consejos para Mejorar**
- Implementa funciones de deshacer para acciones importantes
- Proporciona botones de cancelar en todos los procesos
- Permite navegación hacia atrás sin perder progreso
- Ofrece múltiples formas de realizar la misma tarea

#### ❌ **Ejemplo Mal Aplicado**
```html
<!-- Modal sin escape fácil -->
<div class="modal" id="modal">
  <div class="modal-content">
    <h2>Proceso en curso...</h2>
    <p>Por favor espere mientras procesamos su solicitud.</p>
    <!-- No hay botón de cerrar o cancelar -->
  </div>
</div>
```
**Problema**: El usuario queda atrapado sin forma de cancelar o salir.

#### ✅ **Ejemplo Bien Aplicado**
```html
<!-- Modal con múltiples opciones de salida -->
<div class="modal" id="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Proceso en curso...</h2>
      <button class="close-btn" onclick="closeModal()">✕</button>
    </div>
    <p>Procesando su solicitud...</p>
    <div class="modal-actions">
      <button onclick="cancelProcess()">Cancelar</button>
      <button onclick="continueInBackground()">Continuar en segundo plano</button>
    </div>
  </div>
</div>
```
---
![captura pagina 4](capturas/pag4-cosistencia.png)
### 4. 📏 Consistencia y Estándares

#### 📖 **Concepto**
Los usuarios no deberían preguntarse si diferentes palabras, situaciones o acciones significan lo mismo. Sigue las convenciones de la plataforma y la industria.

#### 🎯 **Ejemplo de Aplicación**
Usar colores consistentes (rojo para peligro, verde para éxito), ubicar el logo en la esquina superior izquierda, o seguir patrones de navegación estándar.

#### 💡 **Consejos para Mejorar**
- Mantén consistencia en colores, tipografía y espaciado
- Usa patrones de interacción familiares
- Sigue las guías de diseño de la plataforma (Material Design, Human Interface Guidelines)
- Crea un sistema de diseño documentado

#### ❌ **Ejemplo Mal Aplicado**
```html
<!-- Inconsistencia en botones -->
<button class="btn-primary">Guardar</button>      <!-- Azul -->
<button class="btn-success">Confirmar</button>    <!-- Verde -->
<button class="btn-warning">Aceptar</button>      <!-- Amarillo -->
<button class="btn-info">OK</button>             <!-- Celeste -->
```
**Problema**: Acciones similares tienen estilos diferentes, confundiendo al usuario.

#### ✅ **Ejemplo Bien Aplicado**
```html
<!-- Consistencia en acciones similares -->
<button class="btn-primary">Guardar</button>
<button class="btn-primary">Confirmar</button>
<button class="btn-primary">Aceptar</button>
<button class="btn-secondary">Cancelar</button>
<button class="btn-danger">Eliminar</button>
```

---
![captura pagina 5](capturas/pag5-prevencion-errores.png)
### 5. 🚫 Prevención de Errores

#### 📖 **Concepto**
Mejor que buenos mensajes de error es un diseño cuidadoso que previene que ocurra un problema en primer lugar. Elimina condiciones propensas a errores o verifica y presenta una opción de confirmación antes de que se comprometan con la acción.

#### 🎯 **Ejemplo de Aplicación**
Validación en tiempo real de formularios, confirmaciones para acciones destructivas, o deshabilitar botones cuando no se pueden usar.

#### 💡 **Consejos para Mejorar**
- Valida datos mientras el usuario escribe
- Deshabilita opciones que no están disponibles
- Usa confirmaciones para acciones irreversibles
- Proporciona valores por defecto sensatos

#### ❌ **Ejemplo Mal Aplicado**
```html
<!-- Sin validación preventiva -->
<form>
  <input type="email" name="email" placeholder="Email">
  <input type="password" name="password" placeholder="Contraseña">
  <button type="submit">Registrar</button>
</form>
```
**Problema**: Solo se valida después del envío, frustrando al usuario.

#### ✅ **Ejemplo Bien Aplicado**
```html
<!-- Con validación preventiva -->
<form>
  <div class="input-group">
    <input type="email" name="email" placeholder="Email" 
           oninput="validateEmail(this)" required>
    <span class="validation-msg" id="email-error"></span>
  </div>
  
  <div class="input-group">
    <input type="password" name="password" placeholder="Contraseña (min. 8 caracteres)" 
           oninput="validatePassword(this)" minlength="8" required>
    <span class="validation-msg" id="password-error"></span>
  </div>
  
  <button type="submit" id="submitBtn" disabled>Registrar</button>
</form>
```

---
![captura pagina 6](capturas/pag6-reconocimiento.png)
### 6. 💭 Reconocimiento en Lugar de Recordar

#### 📖 **Concepto**
Minimiza la carga de memoria del usuario haciendo visibles objetos, acciones y opciones. El usuario no debería tener que recordar información de una parte del diálogo a otra.

#### 🎯 **Ejemplo de Aplicación**
Menús desplegables con opciones visibles, historial de búsquedas, autocompletar, o mostrar pasos completados en un proceso.

#### 💡 **Consejos para Mejorar**
- Usa menús desplegables en lugar de campos de texto libre
- Implementa autocompletar y sugerencias
- Muestra el progreso y pasos completados
- Proporciona contexto visual sobre la ubicación actual

#### ❌ **Ejemplo Mal Aplicado**
```html
<!-- Requiere memorizar códigos -->
<form>
  <label>Seleccione su país (código ISO):</label>
  <input type="text" placeholder="Ej: US, ES, MX, AR...">
  
  <label>Categoría del producto (código interno):</label>
  <input type="text" placeholder="Ingrese código de 4 dígitos">
</form>
```
**Problema**: El usuario debe recordar códigos específicos.

#### ✅ **Ejemplo Bien Aplicado**
```html
<!-- Opciones visibles y reconocibles -->
<form>
  <label>Seleccione su país:</label>
  <select name="country">
    <option value="US">🇺🇸 Estados Unidos</option>
    <option value="ES">🇪🇸 España</option>
    <option value="MX">🇲🇽 México</option>
    <option value="AR">🇦🇷 Argentina</option>
  </select>
  
  <label>Categoría del producto:</label>
  <select name="category">
    <option value="electronics">📱 Electrónicos</option>
    <option value="clothing">👕 Ropa</option>
    <option value="books">📚 Libros</option>
  </select>
</form>
```

---

## 📖 Referencias Bibliográficas

Las heurísticas de usabilidad presentadas en este documento se basan en los trabajos seminales de Jakob Nielsen y Rolf Molich, quienes establecieron las bases teóricas y metodológicas para la evaluación heurística de interfaces de usuario.

### Fuentes Principales:

**Molich, R., y Nielsen, J. (1990).** Mejorando un diálogo humano-computadora. *Communications of the ACM*, 33(3), 338-348.

**Nielsen, J., y Molich, R. (1990).** Evaluación heurística de interfaces de usuario. *Proceedings of the ACM CHI'90 Conference* (Seattle, WA, 1-5 de abril), 249-256.

**Nielsen, J. (1994a).** Mejorando el poder explicativo de las heurísticas de usabilidad. *Proceedings of the ACM CHI'94 Conference* (Boston, MA, 24-28 de abril), 152-158.

**Nielsen, J. (1994b).** Evaluación heurística. En Nielsen, J., y Mack, R.L. (Eds.), *Métodos de inspección de usabilidad*. John Wiley & Sons, Nueva York, NY.


## 🎓 Conclusión

Las heurísticas de usabilidad de Nielsen siguen siendo relevantes después de más de 30 años porque abordan aspectos fundamentales de la cognición humana y la interacción con sistemas digitales. En el desarrollo de frameworks web modernos como Angular, React, Vue o Astro, aplicar estos principios garantiza interfaces más intuitivas, eficientes y satisfactorias para los usuarios.

Recordar que **la usabilidad no es un lujo**, sino una necesidad fundamental para el éxito de cualquier aplicación web moderna.

---