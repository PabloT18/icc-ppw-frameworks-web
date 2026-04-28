# Solución Práctica 8 - Formularios y Validación

## Descripción

Solución completa de la práctica de formularios con validación en tiempo real usando JavaScript puro.

## Estructura del proyecto

```
08-formularios-validacion/
├── index.html            # HTML con formulario completo
├── css/
│   └── styles.css        # Estilos completos con estados de validación
└── js/
    ├── validacion.js     # Servicio de validación y expresiones regulares
    ├── components.js     # Componentes reutilizables (mensajes, cards)
    └── app.js            # Lógica principal y event listeners
```

## Funcionalidades implementadas

### ✅ Validación de campos

- **Nombre**: 3-50 caracteres, solo letras y espacios
- **Email**: Formato válido de email
- **Teléfono**: Exactamente 10 dígitos con máscara automática: (099) 999-9999
- **Fecha de nacimiento**: Mayor de 18 años
- **Género**: Selección obligatoria
- **Contraseña**: Mínimo 8 caracteres, una mayúscula, una minúscula y un número
- **Confirmar contraseña**: Debe coincidir con la contraseña
- **Términos y condiciones**: Checkbox obligatorio

### ✅ Feedback visual

- Borde rojo y mensaje de error para campos inválidos
- Borde verde para campos válidos
- Indicador de fuerza de contraseña con 5 niveles
- Mensajes de error específicos por tipo de validación
- Animaciones suaves

### ✅ UX mejorada

- Validación al perder foco (focusout)
- Limpieza de errores al empezar a escribir
- Botón deshabilitado hasta que todos los campos estén llenos
- Máscara de teléfono en tiempo real
- Scroll automático a errores
- Confirmación antes de limpiar
- Foco automático en el primer campo

### ✅ Arquitectura

- **Separación de responsabilidades**: Validación, componentes y lógica de aplicación en archivos separados
- **API del DOM**: Todo construido con `createElement` y `appendChild` (no `innerHTML`)
- **Servicio de validación**: Centraliza toda la lógica de validación
- **Componentes reutilizables**: Mensajes y cards construidos dinámicamente

## Cómo usar

1. Abrir `index.html` en el navegador
2. Llenar el formulario
3. Observar la validación en tiempo real
4. Enviar el formulario (se muestran los datos abajo)

## Validaciones implementadas

### Constraint Validation API

Se usa la API nativa de validación de JavaScript:
- `campo.validity.valid`
- `campo.validity.valueMissing`
- `campo.validity.typeMismatch`
- `campo.validity.patternMismatch`

### Validaciones personalizadas

Además de la API nativa, se implementan validaciones custom:
- Verificación de edad (fecha de nacimiento)
- Coincidencia de contraseñas
- Fuerza de contraseña
- Formatos específicos con regex

## Expresiones regulares

```javascript
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^\d{10}$/,
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
};
```

## Eventos utilizados

- `submit` - Validación completa y envío
- `focusout` - Validación individual al perder foco
- `input` - Limpiar errores, actualizar fuerza de contraseña, máscara de teléfono
- `click` - Limpiar formulario

## Tecnologías

- HTML5
- CSS3 (variables, flexbox, animaciones)
- JavaScript ES6+ (async/await, arrow functions, destructuring)
- DOM API (createElement, appendChild, classList, dataset)

## Notas

- No usa frameworks ni librerías externas
- Todo el código es JavaScript puro (Vanilla JS)
- Compatible con navegadores modernos
- Diseño responsive
- Código documentado con JSDoc
