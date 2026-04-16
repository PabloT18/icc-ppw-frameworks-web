## Instructivo único de línea gráfica institucional

Usa una sola línea gráfica para todos los HTML institucionales. El objetivo es que cards, tablas, chips, enlaces, títulos y bloques informativos mantengan la misma identidad visual en todas las páginas. La referencia base debe tomar el azul institucional, fondos suaves, bordes claros, radios consistentes y acento amarillo ya presentes en el primer HTML, y aplicar esa misma lógica a los componentes del segundo HTML.  

## 1. Colores oficiales

Define estos colores como base fija:

```css
:root {
  --color-primary: #003772;
  --color-primary-soft: #07508E;
  --color-accent: #FCC000;

  --color-bg: #F7F9FC;
  --color-surface: #FFFFFF;
  --color-surface-soft: #EEF4FA;

  --color-border: #E3E8EF;
  --color-border-soft: #D6E2F0;

  --color-text: #2E3A46;
  --color-text-soft: #6B7785;

  --shadow-sm: 0 2px 6px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 14px rgba(0,0,0,0.06);

  --radius-lg: 14px;
  --radius-md: 12px;
  --radius-sm: 10px;
  --radius-pill: 20px;
}
```

## 2. Tipografía general

Mantén una sola familia tipográfica en todo el sistema:

```css
body {
  font-family: Arial, Helvetica, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
}
```

## 3. Contenedor principal

Todos los bloques institucionales deben vivir dentro de un contenedor consistente:

```css
.layout-container {
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px;
}
```

## 4. Títulos

Usa una jerarquía fija:

```css
.page-title {
  margin: 0 0 20px 0;
  font-size: 30px;
  font-weight: 700;
  color: var(--color-primary);
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-soft);
}

.block-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}
```

## 5. Card institucional

Todas las cards deben tener este estilo, sin variantes improvisadas:

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 20px;
}
```

### Uso

* fichas informativas
* bloques de contenido técnico
* tarjetas comparativas
* resumen de datos
* perfiles o secciones docentes

## 6. Grid de cards

Para agrupar cards:

```css
.card-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

## 7. Chips institucionales

Todos los chips de frameworks, etiquetas o categorías deben usar el mismo estilo:

```css
.chip {
  display: inline-block;
  padding: 4px 10px;
  margin: 2px;
  background: var(--color-surface-soft);
  color: var(--color-primary);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-pill);
  font-size: 12px;
  text-decoration: none;
}
```

### Regla

No usar tonos índigo o morados externos al sistema.

## 8. Tabla institucional

Todas las tablas deben seguir esta estructura:

```css
.table-wrap {
  overflow-x: auto;
  margin: 20px 0;
}

.table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table thead tr {
  background: var(--color-primary);
  color: #FFFFFF;
}

.table th,
.table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.table tbody tr:nth-child(even) {
  background: var(--color-bg);
}

.table tbody tr:nth-child(odd) {
  background: var(--color-surface);
}
```

### Uso

* comparativas
* horarios
* listados técnicos
* matrices de evaluación
* tablas académicas

## 9. Bloque destacado institucional

Para avisos, ubicación, observaciones o información importante:

```css
.callout {
  padding: 20px;
  background: var(--color-bg);
  border-left: 5px solid var(--color-accent);
  border-radius: var(--radius-sm);
}
```

## 10. Enlaces institucionales

Todos los enlaces dentro del sistema deben tener el mismo color:

```css
a {
  color: #0065B0;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

## 11. Header institucional

Para encabezados principales de perfil, asignatura o bloque destacado:

```css
.hero {
  background: linear-gradient(135deg, #003772 0%, #07508E 100%);
  color: #FFFFFF;
  padding: 30px 28px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.hero h1,
.hero h2,
.hero h3 {
  margin: 0;
  color: #FFFFFF;
}

.hero p {
  margin: 8px 0 0 0;
  color: #E8EEF5;
}
```

## 12. Listas institucionales

Para materias, servicios, enlaces o elementos académicos:

```css
.list-box {
  padding: 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.list-box ul {
  margin: 0;
  padding-left: 20px;
}

.list-box li {
  margin-bottom: 6px;
}
```

## 13. Separadores visuales

Usa un solo estilo de separador decorativo:

```css
.section-divider {
  display: flex;
  align-items: center;
  margin: 28px 0 16px 0;
}

.section-divider::before,
.section-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, rgba(0,55,114,0.4), rgba(0,55,114,0));
}

.section-divider::after {
  background: linear-gradient(to left, rgba(0,55,114,0.4), rgba(0,55,114,0));
}

.section-divider span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  margin: 0 12px;
}
```
