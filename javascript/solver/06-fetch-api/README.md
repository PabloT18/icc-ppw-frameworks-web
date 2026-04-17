# Solución Práctica 06 - Fetch API

## Enfoque de implementación

Esta solución utiliza **manipulación del DOM correcta** con la API nativa de JavaScript, evitando el uso de `innerHTML` para contenido dinámico.

## Estructura del proyecto

```
06-fetch-api/
├── index.html          # Estructura HTML completa
├── css/
│   └── styles.css      # Estilos completos
└── js/
    ├── apiService.js   # Servicio para peticiones HTTP (Fetch API)
    ├── components.js   # Componentes que retornan elementos del DOM
    └── app.js          # Lógica principal de la aplicación
```

## Principios aplicados

### 1. NO usar innerHTML para contenido dinámico

**❌ Evitar:**
```javascript
function Tarjeta(post) {
  return `<div class="card"><h3>${post.title}</h3></div>`;
}
contenedor.innerHTML = Tarjeta(post); // INSEGURO
```

**✅ Correcto:**
```javascript
function Tarjeta(post) {
  const div = document.createElement('div');
  div.className = 'card';
  
  const h3 = document.createElement('h3');
  h3.textContent = post.title; // SEGURO
  
  div.appendChild(h3);
  return div; // Retorna HTMLElement
}
contenedor.appendChild(Tarjeta(post)); // SEGURO
```

### 2. Separación de responsabilidades

- **apiService.js**: Toda la lógica de comunicación con la API
- **components.js**: Funciones que construyen elementos del DOM
- **app.js**: Lógica de la aplicación, manejo de estado, eventos

### 3. Componentes retornan elementos del DOM

Cada función componente:
1. Crea elementos con `createElement()`
2. Asigna contenido con `textContent` (seguro)
3. Configura clases con `className` o `classList`
4. Ensambla con `appendChild()`
5. Retorna el elemento `HTMLElement` completo

### 4. Ventajas de este enfoque

| Aspecto | Beneficio |
|---------|-----------|
| **Seguridad** | `textContent` no interpreta HTML, previene XSS |
| **Performance** | No destruye/recrea el DOM completo |
| **Event Listeners** | Se mantienen al manipular el DOM |
| **Mantenibilidad** | Código más claro y depurable |
| **Estándares** | Alineado con mejores prácticas modernas |

## Ejemplo de componente completo

```javascript
/**
 * Componente PostCard
 * Construye una tarjeta de post usando la API del DOM
 */
function PostCard(post) {
  // 1. Crear contenedor principal
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.id = post.id;

  // 2. Crear elementos internos
  const header = document.createElement('div');
  header.className = 'post-card-header';

  const title = document.createElement('h3');
  title.textContent = post.title; // Seguro, no interpreta HTML

  const badge = document.createElement('span');
  badge.textContent = `#${post.id}`;

  // 3. Ensamblar estructura
  header.appendChild(title);
  header.appendChild(badge);
  article.appendChild(header);

  // 4. Retornar elemento del DOM
  return article;
}

// Uso
const tarjeta = PostCard({ id: 1, title: 'Hola' });
contenedor.appendChild(tarjeta);
```

## Flujo de la aplicación

1. **Carga inicial**: `cargarPosts()` obtiene datos de la API
2. **Renderizado**: `renderizarPosts()` crea elementos y los inserta con `appendChild`
3. **Interacción**: Delegación de eventos detecta clicks en botones dinámicos
4. **CRUD**: Operaciones modifican estado y re-renderizan

## Funcionalidades implementadas

- ✅ GET: Cargar lista de posts
- ✅ POST: Crear nuevo post
- ✅ PUT: Actualizar post existente
- ✅ DELETE: Eliminar post
- ✅ Búsqueda: Filtrado local por título/contenido
- ✅ Manejo de errores: Mensajes visuales
- ✅ Estados de carga: Spinner animado
- ✅ UX: Mensajes temporales, scroll automático

## Seguridad

- **Prevención XSS**: Todo contenido dinámico usa `textContent`
- **Validación**: Verificar `response.ok` en cada petición
- **Sanitización**: No se usa `innerHTML` con datos del usuario

## Performance

- **Renderizado eficiente**: Solo se crea lo necesario
- **Event delegation**: Un solo listener para múltiples elementos
- **Estado local**: Evita peticiones innecesarias a la API

## Para estudiantes

Este código es la **referencia completa** de cómo debe implementarse la práctica. Los puntos clave a aprender:

1. Usar `createElement` en lugar de strings HTML
2. Usar `textContent` para asignar contenido de forma segura
3. Construir componentes que retornen elementos del DOM
4. Insertar elementos con `appendChild` en lugar de `innerHTML`
5. Separar responsabilidades en módulos claros

**Recuerda:** La seguridad y mantenibilidad son tan importantes como la funcionalidad.
