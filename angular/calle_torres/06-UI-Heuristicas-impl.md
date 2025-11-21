
# Programación y Plataformas Web

## Frameworks Web: Angular + TailwindCSS

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" width="80" alt="Angular Logo">
  <span style="font-size: 80px; color: black; margin: 20px 20px;">+</span>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="TailwindCSS Logo"/>
</div>

## Práctica 6: Aplicación de Heurísticas de Usabilidad

### Autor

**Pablo Torres**
📧 [ptorresp@ups.edu.ec](mailto:ptorresp@ups.edu.ec)
💻 GitHub: [PabloT18](https://github.com/PabloT18)

---

# Instrucciones: Implementación de Heurísticas con Angular + TailwindCSS

## Objetivo
Desarrollar una aplicación Angular que demuestre cada una de las 10 heurísticas de Nielsen mediante ejemplos prácticos, mostrando implementaciones incorrectas y sus versiones mejoradas utilizando TailwindCSS.

## Estructura del Proyecto

### Componente Principal: Header Heurística

Crea el componente reutilizable `header-heuristica.component.ts`:

```typescript
// src/app/components/header-heuristica/header-heuristica.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-heuristica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white p-8 rounded-2xl shadow-2xl mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <!-- Icono dinámico según la heurística -->
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span class="text-2xl">{{ getIcon() }}</span>
        </div>
        
        <!-- Información principal -->
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-2 tracking-tight">
            {{ titulo() }}
          </h1>
          <div class="flex items-center space-x-2 text-blue-100">
            <span class="w-2 h-2 bg-blue-300 rounded-full"></span>
            <span class="text-sm font-medium uppercase tracking-wider">
              Heurística {{ numeroHeuristica() }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Concepto -->
      <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 class="text-lg font-semibold mb-3 text-blue-100">📖 Concepto:</h3>
        <p class="text-white leading-relaxed">
          {{ concepto() }}
        </p>
      </div>
      
      <!-- Badges informativos -->
      <div class="flex flex-wrap gap-2 mt-6">
        <span class="px-3 py-1 bg-green-500 bg-opacity-80 rounded-full text-xs font-semibold">
          Nielsen Heuristic
        </span>
        <span class="px-3 py-1 bg-blue-500 bg-opacity-80 rounded-full text-xs font-semibold">
          UX Best Practice
        </span>
        <span class="px-3 py-1 bg-purple-500 bg-opacity-80 rounded-full text-xs font-semibold">
          Angular + Tailwind
        </span>
      </div>
    </div>
  `,
  styles: []
})
export class HeaderHeuristicaComponent {
  numeroHeuristica = input.required<string>();
  titulo = input.required<string>();
  concepto = input.required<string>();
  
  getIcon(): string {
    const iconMap: { [key: string]: string } = {
      '1': '👁️', '2': '🌍', '3': '🎮', '4': '📏', '5': '🚫',
      '6': '💭', '7': '⚡', '8': '🎨', '9': '🆘', '10': '📚'
    };
    return iconMap[this.numeroHeuristica()] || '🔍';
  }
}
```

**Explicación de estilos TailwindCSS utilizados:**

- `bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800`: Crea un gradiente horizontal desde azul hasta índigo
- `backdrop-blur-sm`: Efecto de desenfoque de fondo para vidrio esmerilado
- `bg-opacity-20`: Establece la opacidad del fondo al 20%
- `rounded-2xl`: Bordes redondeados extra grandes
- `shadow-2xl`: Sombra muy pronunciada
- `tracking-tight`: Espaciado entre letras más compacto
- `border-opacity-20`: Opacidad del borde al 20%

### Tabla Principal de Navegación

```html
<!-- interfaz-page.html -->
<div class="min-h-screen bg-gray-50 py-12 px-4">
  <div class="max-w-7xl mx-auto">
    <!-- Header Principal -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        🎯 Heurísticas de Usabilidad de Nielsen
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Implementación práctica de las 10 heurísticas fundamentales para crear interfaces de usuario excepcionales
      </p>
    </div>

    <!-- Tabla de Navegación -->
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">📋</span>
          Navegación por Heurísticas
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                #
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heurística
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Icono
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción Breve
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (heuristica of heuristicas; track heuristica.id) {
              <tr class="hover:bg-gray-50 transition-colors duration-200 group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-sm">
                    {{ heuristica.id }}
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ heuristica.titulo }}
                  </div>
                </td>
                
                <td class="px-6 py-4 text-center">
                  <span class="text-3xl">{{ heuristica.icono }}</span>
                </td>
                
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ heuristica.descripcion }}
                  </p>
                </td>
                
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button 
                      [routerLink]="['/heuristica', heuristica.id]"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver Ejemplos
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold">✓</span>
          </div>
          <h3 class="ml-3 text-lg font-semibold text-green-800">Ejemplos Prácticos</h3>
        </div>
        <p class="text-green-700 text-sm">
          Cada heurística incluye ejemplos reales de implementación incorrecta y su versión mejorada.
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl border border-blue-200">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold">⚡</span>
          </div>
          <h3 class="ml-3 text-lg font-semibold text-blue-800">Angular + Tailwind</h3>
        </div>
        <p class="text-blue-700 text-sm">
          Implementaciones modernas usando Angular signals, componentes standalone y TailwindCSS.
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold">🎨</span>
          </div>
          <h3 class="ml-3 text-lg font-semibold text-purple-800">UX Mejorada</h3>
        </div>
        <p class="text-purple-700 text-sm">
          Aprende cómo aplicar principios de usabilidad que mejoran significativamente la experiencia del usuario.
        </p>
      </div>
    </div>
  </div>
</div>
```

```typescript

import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Heuristica {
  id: number;
  titulo: string;
  icono: string;
  descripcion: string;
  ruta: string;
}

@Component({
  selector: 'app-interfaz-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './interfaz-page.html',
  styleUrl: './interfaz-page.css',
})
export class InterfazPage {
  heuristicas = signal<Heuristica[]>([
    {
      id: 1,
      titulo: 'Visibilidad del Estado del Sistema',
      icono: '👁️',
      descripcion: 'El sistema debe mantener informados a los usuarios sobre lo que está ocurriendo.',
      ruta: '/heuristica/1'
    },
    {
      id: 2,
      titulo: 'Correspondencia con el Mundo Real',
      icono: '🌍',
      descripcion: 'El sistema debe hablar el idioma del usuario con conceptos familiares.',
      ruta: '/heuristica/2'
    },
    {
      id: 3,
      titulo: 'Control y Libertad del Usuario',
      icono: '🎮',
      descripcion: 'Los usuarios necesitan controlar el sistema y tener salidas de emergencia.',
      ruta: '/heuristica/3'
    },
    {
      id: 4,
      titulo: 'Consistencia y Estándares',
      icono: '📏',
      descripcion: 'Los usuarios no deben preguntarse si acciones diferentes significan lo mismo.',
      ruta: '/heuristica/4'
    },
    {
      id: 5,
      titulo: 'Prevención de Errores',
      icono: '🚫',
      descripcion: 'Mejor prevenir errores que mostrar buenos mensajes de error.',
      ruta: '/heuristica/5'
    },
    {
      id: 6,
      titulo: 'Reconocimiento vs Recordar',
      icono: '💭',
      descripcion: 'Hacer visibles objetos y acciones en lugar de requerir memoria.',
      ruta: '/heuristica/6'
    },
    {
      id: 7,
      titulo: 'Flexibilidad y Eficiencia',
      icono: '⚡',
      descripción: 'Acelerar la interacción para usuarios expertos sin afectar novatos.',
      ruta: '/heuristica/7'
    },
    {
      id: 8,
      titulo: 'Diseño Estético y Minimalista',
      icono: '🎨',
      descripcion: 'No incluir información irrelevante que compita con contenido importante.',
      ruta: '/heuristica/8'
    },
    {
      id: 9,
      titulo: 'Reconocer y Recuperarse de Errores',
      icono: '🆘',
      descripcion: 'Mensajes de error en lenguaje sencillo con soluciones constructivas.',
      ruta: '/heuristica/9'
    },
    {
      id: 10,
      titulo: 'Ayuda y Documentación',
      icono: '📚',
      descripcion: 'Proporcionar ayuda fácil de buscar, enfocada en tareas del usuario.',
      ruta: '/heuristica/10'
    }
  ]);
}
```


## Crear archivo de navegación

```typescript 
import { Routes } from '@angular/router';

export const heuristicaRoutes: Routes = [
    // Rutas con nombres descriptivos (recomendado)
    {
        path: 'visibilidad-estado-sistema',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page)
    },
    {
        path: 'correspondencia-mundo-real',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H2Page cuando esté listo
    },
    {
        path: 'control-libertad-usuario',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H3Page cuando esté listo
    },
    {
        path: 'consistencia-estandares',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H4Page cuando esté listo
    },
    {
        path: 'prevencion-errores',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H5Page cuando esté listo
    },
    {
        path: 'reconocimiento-recordar',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H6Page cuando esté listo
    },
    {
        path: 'flexibilidad-eficiencia',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H7Page cuando esté listo
    },
    {
        path: 'diseno-estetico-minimalista',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H8Page cuando esté listo
    },
    {
        path: 'ayuda-reconocer-errores',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H9Page cuando esté listo
    },
    {
        path: 'ayuda-documentacion',
        loadComponent: () => import('./h1-page/h1-page').then(m => m.H1Page) // Temporal, cambiar por H10Page cuando esté listo
    },

    // También mantenemos las rutas con números para compatibilidad
    {
        path: '1',
        redirectTo: 'visibilidad-estado-sistema'
    },
    {
        path: '2',
        redirectTo: 'correspondencia-mundo-real'
    },
    {
        path: '3',
        redirectTo: 'control-libertad-usuario'
    },
    {
        path: '4',
        redirectTo: 'consistencia-estandares'
    },
    {
        path: '5',
        redirectTo: 'prevencion-errores'
    },
    {
        path: '6',
        redirectTo: 'reconocimiento-recordar'
    },
    {
        path: '7',
        redirectTo: 'flexibilidad-eficiencia'
    },
    {
        path: '8',
        redirectTo: 'diseno-estetico-minimalista'
    },
    {
        path: '9',
        redirectTo: 'ayuda-reconocer-errores'
    },
    {
        path: '10',
        redirectTo: 'ayuda-documentacion'
    },

    // Ruta por defecto
    {
        path: '',
        redirectTo: 'visibilidad-estado-sistema',
        pathMatch: 'full'
    },

    // Ruta wildcard para rutas no encontradas
    {
        path: '**',
        redirectTo: 'visibilidad-estado-sistema'
    }
];
```

* Usarlo en `app.routes.ts` para enlazar todas las rutas de heurísticas:

# Práctica Heurísticas de Usabilidad

## 1. Visibilidad del Estado del Sistema

### Crear el componente `estado-sistema.component.ts`

**HTML y TS sin aplicar la heurística:**

```typescript
// estado-sistema-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estado-sistema-malo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Subir Archivo</h2>
      
      <!-- Sin indicadores de estado -->
      <input type="file" (change)="onFileSelect($event)" class="mb-4">
      
      <!-- Botón sin feedback visual -->
      <button (click)="uploadFile()" class="bg-blue-500 text-white px-4 py-2 rounded">
        Subir
      </button>
      
      <!-- Sin mostrar progreso -->
      <div class="mt-4">
        <p>Resultado aparecerá aquí...</p>
      </div>
    </div>
  `
})
export class EstadoSistemaMaloComponent {
  selectedFile: File | null = null;
  
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  uploadFile() {
    if (!this.selectedFile) return;
    
    // Simula subida - SIN FEEDBACK AL USUARIO
    setTimeout(() => {
      console.log('Archivo subido');
    }, 3000);
  }
}
```

**¿Por qué no está aplicada la heurística?**
- No hay indicación visual de que se está procesando la subida
- El usuario no sabe si el botón funcionó o si debe hacer clic nuevamente
- No hay barra de progreso ni porcentaje de completado
- No se muestra el estado actual del proceso (iniciando, subiendo, completado)

### Mitigación - Versión Mejorada:

```typescript
// estado-sistema-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estado-sistema-bueno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-4">
        <span class="text-2xl mr-3">📁</span>
        <h2 class="text-xl font-semibold">Subir Archivo</h2>
      </div>
      
      <!-- Selector de archivo con estado visual -->
      <div class="mb-4">
        <input 
          type="file" 
          (change)="onFileSelect($event)" 
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
        
        @if (selectedFile) {
          <div class="mt-2 flex items-center text-sm text-green-600">
            <span class="mr-2">✅</span>
            Archivo seleccionado: {{ selectedFile.name }}
          </div>
        }
      </div>
      
      <!-- Botón con estados visuales dinámicos -->
      <button 
        (click)="uploadFile()" 
        [disabled]="!selectedFile || isUploading()"
        class="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
        [ngClass]="{
          'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer': selectedFile && !isUploading() && !uploadComplete(),
          'bg-gray-300 text-gray-500 cursor-not-allowed': !selectedFile,
          'bg-orange-500 text-white cursor-not-allowed': isUploading(),
          'bg-green-500 text-white': uploadComplete()
        }">
        
        @if (isUploading()) {
          <!-- Spinner animado -->
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Subiendo... {{ progress() }}%
        } @else if (uploadComplete()) {
          <span class="mr-2">✅</span>
          ¡Subido Exitosamente!
        } @else {
          <span class="mr-2">📤</span>
          {{ selectedFile ? 'Subir Archivo' : 'Selecciona un archivo' }}
        }
      </button>
      
      <!-- Barra de progreso visible -->
      @if (isUploading() || uploadComplete()) {
        <div class="mt-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso de subida</span>
            <span>{{ progress() }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300 ease-out"
              [ngClass]="{
                'bg-gradient-to-r from-blue-400 to-blue-600': progress() < 100,
                'bg-gradient-to-r from-green-400 to-green-600': progress() === 100
              }"
              [style.width.%]="progress()">
            </div>
          </div>
        </div>
      }
      
      <!-- Mensajes de estado detallados -->
      <div class="mt-4 p-3 rounded-lg" [ngClass]="{
        'bg-blue-50 border border-blue-200': currentStatus() === 'preparing',
        'bg-orange-50 border border-orange-200': currentStatus() === 'uploading', 
        'bg-green-50 border border-green-200': currentStatus() === 'completed',
        'bg-gray-50 border border-gray-200': currentStatus() === 'idle'
      }">
        <div class="flex items-center text-sm">
          <span class="mr-2">{{ getStatusIcon() }}</span>
          <span class="font-medium">{{ getStatusMessage() }}</span>
        </div>
      </div>
    </div>
  `
})
export class EstadoSistemaBuenoComponent {
  selectedFile: File | null = null;
  isUploading = signal(false);
  uploadComplete = signal(false);
  progress = signal(0);
  currentStatus = signal<'idle' | 'preparing' | 'uploading' | 'completed'>('idle');
  
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.currentStatus.set('preparing');
      this.uploadComplete.set(false);
      this.progress.set(0);
    }
  }
  
  uploadFile() {
    if (!this.selectedFile || this.isUploading()) return;
    
    this.isUploading.set(true);
    this.currentStatus.set('uploading');
    this.progress.set(0);
    
    // Simula progreso realista de subida
    const interval = setInterval(() => {
      const currentProgress = this.progress();
      if (currentProgress < 100) {
        // Progreso irregular más realista
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(currentProgress + increment, 100);
        this.progress.set(Math.floor(newProgress));
      } else {
        clearInterval(interval);
        this.isUploading.set(false);
        this.uploadComplete.set(true);
        this.currentStatus.set('completed');
      }
    }, 200);
  }
  
  getStatusIcon(): string {
    switch (this.currentStatus()) {
      case 'preparing': return '📋';
      case 'uploading': return '⬆️';
      case 'completed': return '✅';
      default: return '💤';
    }
  }
  
  getStatusMessage(): string {
    switch (this.currentStatus()) {
      case 'preparing': return 'Listo para subir - Haz clic en el botón';
      case 'uploading': return `Subiendo archivo... ${this.progress()}% completado`;
      case 'completed': return '¡Archivo subido exitosamente al servidor!';
      default: return 'Esperando selección de archivo...';
    }
  }
}
```

## 2. Correspondencia entre el Sistema y el Mundo Real

### Crear el componente `mundo-real.component.ts`

**HTML y TS sin aplicar la heurística:**

```typescript
// mundo-real-malo.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mundo-real-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Sistema de Archivos</h2>
      
      <!-- Terminología técnica confusa -->
      <div class="space-y-3">
        <button class="block w-full p-3 bg-gray-200 text-left rounded" 
                (click)="executeOperation('init_fs')">
          Inicializar Sistema de Archivos (init_fs)
        </button>
        
        <button class="block w-full p-3 bg-gray-200 text-left rounded"
                (click)="executeOperation('create_node')">
          Crear Nodo de Directorio (create_node)
        </button>
        
        <button class="block w-full p-3 bg-gray-200 text-left rounded"
                (click)="executeOperation('alloc_mem')">
          Asignar Memoria de Buffer (alloc_mem)
        </button>
        
        <button class="block w-full p-3 bg-gray-200 text-left rounded"
                (click)="executeOperation('persist_data')">
          Persistir Datos en Storage (persist_data)
        </button>
      </div>
      
      <div class="mt-4 p-3 bg-gray-100 rounded">
        <p class="text-sm">Output: {{ lastOperation() }}</p>
      </div>
    </div>
  `
})
export class MundoRealMaloComponent {
  lastOperation = signal('');
  
  executeOperation(op: string) {
    this.lastOperation.set(`Ejecutado: ${op}`);
  }
}
```

**¿Por qué no está aplicada la heurística?**
- Usa terminología técnica que solo entienden programadores
- Los nombres de las acciones no corresponden con conceptos del mundo real
- No hay iconos o metáforas familiares para el usuario
- El lenguaje es interno del sistema, no del dominio del usuario

### Mitigación - Versión Mejorada:

```typescript
// mundo-real-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mundo-real-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">🗂️</span>
        <h2 class="text-xl font-semibold">Mi Escritorio</h2>
      </div>
      
      <!-- Acciones familiares con iconos del mundo real -->
      <div class="space-y-3">
        <button 
          class="flex items-center w-full p-4 bg-blue-50 hover:bg-blue-100 text-left rounded-lg border border-blue-200 transition-colors"
          (click)="executeOperation('Abrir mi escritorio')">
          <span class="text-2xl mr-4">🖥️</span>
          <div>
            <div class="font-medium">Abrir Escritorio</div>
            <div class="text-sm text-gray-600">Ver todos mis archivos y carpetas</div>
          </div>
        </button>
        
        <button 
          class="flex items-center w-full p-4 bg-green-50 hover:bg-green-100 text-left rounded-lg border border-green-200 transition-colors"
          (click)="executeOperation('Crear nueva carpeta')">
          <span class="text-2xl mr-4">📁</span>
          <div>
            <div class="font-medium">Nueva Carpeta</div>
            <div class="text-sm text-gray-600">Organizar archivos en una carpeta</div>
          </div>
        </button>
        
        <button 
          class="flex items-center w-full p-4 bg-yellow-50 hover:bg-yellow-100 text-left rounded-lg border border-yellow-200 transition-colors"
          (click)="executeOperation('Copiar archivos al portapapeles')">
          <span class="text-2xl mr-4">📋</span>
          <div>
            <div class="font-medium">Copiar</div>
            <div class="text-sm text-gray-600">Copiar archivos al portapapeles</div>
          </div>
        </button>
        
        <button 
          class="flex items-center w-full p-4 bg-purple-50 hover:bg-purple-100 text-left rounded-lg border border-purple-200 transition-colors"
          (click)="executeOperation('Guardar documento')">
          <span class="text-2xl mr-4">💾</span>
          <div>
            <div class="font-medium">Guardar</div>
            <div class="text-sm text-gray-600">Guardar cambios en el documento</div>
          </div>
        </button>
        
        <button 
          class="flex items-center w-full p-4 bg-red-50 hover:bg-red-100 text-left rounded-lg border border-red-200 transition-colors"
          (click)="executeOperation('Mover a la papelera')">
          <span class="text-2xl mr-4">🗑️</span>
          <div>
            <div class="font-medium">Eliminar</div>
            <div class="text-sm text-gray-600">Mover archivos a la papelera</div>
          </div>
        </button>
      </div>
      
      <!-- Feedback en lenguaje natural -->
      @if (lastOperation()) {
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-center">
            <span class="text-xl mr-3">✅</span>
            <div>
              <div class="font-medium text-blue-900">¡Listo!</div>
              <div class="text-sm text-blue-700">{{ lastOperation() }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MundoRealBuenoComponent {
  lastOperation = signal('');
  
  executeOperation(action: string) {
    this.lastOperation.set(action);
  }
}
```

## 3. Control y Libertad del Usuario

### Crear el componente `control-libertad.component.ts`

**HTML y TS sin aplicar la heurística:**

```typescript
// control-libertad-malo.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-libertad-malo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Editor de Texto</h2>
      
      <!-- Sin opciones de deshacer/rehacer -->
      <textarea 
        [(ngModel)]="content" 
        class="w-full h-32 p-3 border rounded resize-none"
        placeholder="Escribe aquí...">
      </textarea>
      
      <!-- Modal que no se puede cerrar fácilmente -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded max-w-sm">
            <h3 class="text-lg mb-4">Procesando...</h3>
            <p class="mb-4">Por favor espera mientras guardamos tu texto.</p>
            <!-- NO HAY BOTÓN DE CANCELAR -->
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      }
      
      <div class="mt-4">
        <button 
          (click)="saveText()"
          class="bg-blue-500 text-white px-4 py-2 rounded">
          Guardar Texto
        </button>
      </div>
    </div>
  `
})
export class ControlLibertadMaloComponent {
  content = '';
  showModal = signal(false);
  
  saveText() {
    this.showModal.set(true);
    // Usuario queda atrapado por 5 segundos sin poder cancelar
    setTimeout(() => {
      this.showModal.set(false);
    }, 5000);
  }
}
```

**¿Por qué no está aplicada la heurística?**
- No hay opciones de deshacer/rehacer para el editor
- El modal bloquea completamente al usuario sin opción de cancelar
- No hay forma de salir del proceso una vez iniciado
- Falta control granular sobre las acciones del sistema

### Mitigación - Versión Mejorada:

```typescript
// control-libertad-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-libertad-bueno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <span class="text-2xl mr-3">📝</span>
          <h2 class="text-xl font-semibold">Editor de Texto</h2>
        </div>
        
        <!-- Controles de deshacer/rehacer -->
        <div class="flex space-x-2">
          <button 
            (click)="undo()"
            [disabled]="!canUndo()"
            class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg border transition-colors"
            title="Deshacer (Ctrl+Z)">
            ↶ Deshacer
          </button>
          
          <button 
            (click)="redo()"
            [disabled]="!canRedo()"
            class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg border transition-colors"
            title="Rehacer (Ctrl+Y)">
            ↷ Rehacer
          </button>
        </div>
      </div>
      
      <!-- Editor con historial -->
      <textarea 
        [(ngModel)]="content" 
        (input)="onTextChange()"
        class="w-full h-40 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
        placeholder="Escribe aquí... Usa Ctrl+Z para deshacer y Ctrl+Y para rehacer">
      </textarea>
      
      <!-- Información del historial -->
      <div class="mt-2 text-sm text-gray-600 flex justify-between">
        <span>Cambios: {{ history().length }}</span>
        <span>Posición: {{ currentIndex() + 1 }}</span>
      </div>
      
      <!-- Modal controlable por el usuario -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-xl max-w-md w-full mx-4 border">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Guardando Texto</h3>
              <!-- Botón X para cerrar -->
              <button 
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                ×
              </button>
            </div>
            
            <div class="mb-4">
              <p class="mb-2">Guardando tu documento...</p>
              <!-- Barra de progreso -->
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  [style.width.%]="saveProgress()">
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ saveProgress() }}% completado</p>
            </div>
            
            <!-- Múltiples opciones de control -->
            <div class="flex space-x-3">
              <button 
                (click)="cancelSave()"
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                ❌ Cancelar
              </button>
              
              <button 
                (click)="saveInBackground()"
                class="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                🔄 Continuar en segundo plano
              </button>
            </div>
          </div>
        </div>
      }
      
      <!-- Controles principales -->
      <div class="mt-6 flex space-x-3">
        <button 
          (click)="saveText()"
          [disabled]="content.length === 0"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors">
          💾 Guardar Texto
        </button>
        
        <button 
          (click)="clearText()"
          [disabled]="content.length === 0"
          class="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg font-medium transition-colors">
          🗑️ Limpiar Todo
        </button>
        
        <button 
          (click)="loadTemplate()"
          class="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors">
          📄 Cargar Plantilla
        </button>
      </div>
    </div>
  `
})
export class ControlLibertadBuenoComponent {
  content = '';
  showModal = signal(false);
  saveProgress = signal(0);
  history = signal<string[]>(['']);
  currentIndex = signal(0);
  
  onTextChange() {
    const newHistory = this.history().slice(0, this.currentIndex() + 1);
    newHistory.push(this.content);
    this.history.set(newHistory);
    this.currentIndex.set(newHistory.length - 1);
  }
  
  canUndo(): boolean {
    return this.currentIndex() > 0;
  }
  
  canRedo(): boolean {
    return this.currentIndex() < this.history().length - 1;
  }
  
  undo() {
    if (this.canUndo()) {
      this.currentIndex.update(i => i - 1);
      this.content = this.history()[this.currentIndex()];
    }
  }
  
  redo() {
    if (this.canRedo()) {
      this.currentIndex.update(i => i + 1);
      this.content = this.history()[this.currentIndex()];
    }
  }
  
  saveText() {
    this.showModal.set(true);
    this.saveProgress.set(0);
    
    const interval = setInterval(() => {
      const progress = this.saveProgress();
      if (progress < 100) {
        this.saveProgress.set(Math.min(progress + 20, 100));
      } else {
        clearInterval(interval);
        setTimeout(() => this.closeModal(), 1000);
      }
    }, 500);
  }
  
  closeModal() {
    this.showModal.set(false);
    this.saveProgress.set(0);
  }
  
  cancelSave() {
    this.closeModal();
  }
  
  saveInBackground() {
    this.showModal.set(false);
    // Continúa guardando en segundo plano
  }
  
  clearText() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el texto?')) {
      this.content = '';
      this.onTextChange();
    }
  }
  
  loadTemplate() {
    this.content = 'Plantilla de ejemplo:\n\n1. Introducción\n2. Desarrollo\n3. Conclusiones';
    this.onTextChange();
  }
}
```

Para esta página, usa el componente header así:

```html
<app-header-heuristica 
  numeroHeuristica="1"
  titulo="Visibilidad del Estado del Sistema"
  concepto="El sistema debe mantener a los usuarios informados sobre lo que está ocurriendo, proporcionando retroalimentación apropiada dentro de un tiempo razonable. Los usuarios nunca deben preguntarse qué está pasando en el sistema.">
</app-header-heuristica>
```

### 🔴 Ejemplo Malo: Formulario de Registro Sin Feedback

**Problema:** El usuario no recibe ninguna indicación del progreso, estado de validación, o si el sistema está procesando su información.

```typescript
// registro-malo.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-malo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 class="text-2xl mb-4">Registro de Usuario</h2>
      
      <!-- SIN INDICADORES DE ESTADO -->
      <form (ngSubmit)="onSubmit()">
        <input 
          type="text" 
          [(ngModel)]="nombre" 
          name="nombre"
          placeholder="Nombre completo"
          class="w-full p-2 border mb-4">
          
        <input 
          type="email" 
          [(ngModel)]="email" 
          name="email"
          placeholder="Email"
          class="w-full p-2 border mb-4">
          
        <input 
          type="password" 
          [(ngModel)]="password" 
          name="password"
          placeholder="Contraseña"
          class="w-full p-2 border mb-4">
          
        <!-- Botón sin cambios visuales -->
        <button 
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded">
          Registrar
        </button>
      </form>
    </div>
  `
})
export class RegistroMaloComponent {
  nombre = '';
  email = '';
  password = '';
  
  onSubmit() {
    // Simula proceso que toma tiempo - SIN FEEDBACK
    setTimeout(() => {
      console.log('Usuario registrado');
    }, 3000);
  }
}
```

**¿Por qué está mal aplicada la heurística?**
- No hay indicación de que el formulario se está procesando
- No se valida en tiempo real si los datos son correctos
- El usuario puede hacer clic múltiples veces sin saber qué pasa
- No hay feedback sobre el progreso del registro

### ✅ Ejemplo Bueno: Formulario con Feedback Completo

```typescript
// registro-bueno.component.ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-bueno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <span class="text-white font-bold">👤</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Registro de Usuario</h2>
      </div>
      
      <!-- BARRA DE PROGRESO -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span>{{ calcularProgreso() }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            [style.width.%]="calcularProgreso()">
          </div>
        </div>
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <!-- Campo Nombre con validación visual -->
        <div class="mb-4">
          <div class="relative">
            <input 
              type="text" 
              [(ngModel)]="nombre" 
              name="nombre"
              (input)="validarNombre()"
              placeholder="Nombre completo"
              class="w-full p-3 border-2 rounded-lg transition-all duration-200"
              [class]="getInputClass('nombre')">
              
            <!-- Indicador de validación -->
            <div class="absolute right-3 top-3">
              @if (validaciones.nombre === 'valid') {
                <span class="text-green-500 text-xl">✓</span>
              } @else if (validaciones.nombre === 'invalid') {
                <span class="text-red-500 text-xl">✗</span>
              }
            </div>
          </div>
          
          @if (validaciones.nombre === 'invalid') {
            <p class="text-red-500 text-sm mt-1 flex items-center">
              <span class="mr-1">⚠️</span>
              El nombre debe tener al menos 3 caracteres
            </p>
          }
        </div>

        <!-- Campo Email con validación -->
        <div class="mb-4">
          <div class="relative">
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              (input)="validarEmail()"
              placeholder="correo@ejemplo.com"
              class="w-full p-3 border-2 rounded-lg transition-all duration-200"
              [class]="getInputClass('email')">
              
            <div class="absolute right-3 top-3">
              @if (validaciones.email === 'valid') {
                <span class="text-green-500 text-xl">✓</span>
              } @else if (validaciones.email === 'invalid') {
                <span class="text-red-500 text-xl">✗</span>
              }
            </div>
          </div>
          
          @if (validaciones.email === 'invalid') {
            <p class="text-red-500 text-sm mt-1 flex items-center">
              <span class="mr-1">⚠️</span>
              Ingresa un email válido
            </p>
          }
        </div>

        <!-- Campo Contraseña con indicador de fuerza -->
        <div class="mb-6">
          <div class="relative">
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              (input)="validarPassword()"
              placeholder="Contraseña segura"
              class="w-full p-3 border-2 rounded-lg transition-all duration-200"
              [class]="getInputClass('password')">
              
            <div class="absolute right-3 top-3">
              @if (validaciones.password === 'valid') {
                <span class="text-green-500 text-xl">✓</span>
              } @else if (validaciones.password === 'invalid') {
                <span class="text-red-500 text-xl">✗</span>
              }
            </div>
          </div>
          
          <!-- Medidor de fuerza de contraseña -->
          @if (password.length > 0) {
            <div class="mt-2">
              <div class="flex space-x-1">
                @for (nivel of [1,2,3,4]; track nivel) {
                  <div 
                    class="h-2 flex-1 rounded"
                    [class]="getPasswordStrengthClass(nivel)">
                  </div>
                }
              </div>
              <p class="text-sm mt-1" [class]="getPasswordTextClass()">
                {{ getPasswordStrengthText() }}
              </p>
            </div>
          }
        </div>
          
        <!-- Botón con estados visuales -->
        <button 
          type="submit"
          [disabled]="!formularioValido() || enviando()"
          class="w-full p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
          [class]="getButtonClass()">
          
          @if (enviando()) {
            <!-- Spinner de carga -->
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          } @else if (registroExitoso()) {
            <span class="mr-2">✅</span>
            ¡Registrado exitosamente!
          } @else {
            <span class="mr-2">🚀</span>
            Crear Cuenta
          }
        </button>
      </form>
      
      <!-- Mensaje de estado global -->
      @if (mensaje()) {
        <div class="mt-4 p-3 rounded-lg" [class]="getMensajeClass()">
          <div class="flex items-center">
            <span class="mr-2">{{ mensaje().tipo === 'success' ? '✅' : '⚠️' }}</span>
            {{ mensaje().texto }}
          </div>
        </div>
      }
    </div>
  `
})
export class RegistroBuenoComponent {
  nombre = '';
  email = '';
  password = '';
  
  enviando = signal(false);
  registroExitoso = signal(false);
  mensaje = signal<{tipo: 'success' | 'error', texto: string} | null>(null);
  
  validaciones = signal({
    nombre: 'neutral' as 'valid' | 'invalid' | 'neutral',
    email: 'neutral' as 'valid' | 'invalid' | 'neutral', 
    password: 'neutral' as 'valid' | 'invalid' | 'neutral'
  });
  
  passwordStrength = signal(0);
  
  validarNombre() {
    const valido = this.nombre.length >= 3;
    this.validaciones.update(v => ({...v, nombre: valido ? 'valid' : 'invalid'}));
  }
  
  validarEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valido = emailRegex.test(this.email);
    this.validaciones.update(v => ({...v, email: valido ? 'valid' : 'invalid'}));
  }
  
  validarPassword() {
    let strength = 0;
    if (this.password.length >= 8) strength++;
    if (/[A-Z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[^A-Za-z0-9]/.test(this.password)) strength++;
    
    this.passwordStrength.set(strength);
    const valido = strength >= 3;
    this.validaciones.update(v => ({...v, password: valido ? 'valid' : 'invalid'}));
  }
  
  calcularProgreso(): number {
    const validCount = Object.values(this.validaciones()).filter(v => v === 'valid').length;
    return Math.round((validCount / 3) * 100);
  }
  
  formularioValido(): boolean {
    return Object.values(this.validaciones()).every(v => v === 'valid');
  }
  
  getInputClass(campo: string): string {
    const estado = this.validaciones()[campo as keyof typeof this.validaciones];
    const baseClass = 'focus:outline-none focus:ring-2';
    
    switch (estado) {
      case 'valid':
        return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-200`;
      case 'invalid':
        return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-200`;
      default:
        return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-blue-200`;
    }
  }
  
  getPasswordStrengthClass(nivel: number): string {
    if (nivel <= this.passwordStrength()) {
      switch (this.passwordStrength()) {
        case 1: return 'bg-red-400';
        case 2: return 'bg-orange-400';
        case 3: return 'bg-yellow-400';
        case 4: return 'bg-green-400';
        default: return 'bg-gray-200';
      }
    }
    return 'bg-gray-200';
  }
  
  getPasswordStrengthText(): string {
    switch (this.passwordStrength()) {
      case 1: return '🔴 Débil - Agrega mayúsculas y números';
      case 2: return '🟠 Regular - Incluye símbolos especiales';
      case 3: return '🟡 Buena - Muy bien, es segura';
      case 4: return '🟢 Excelente - Contraseña muy segura';
      default: return 'Mínimo 8 caracteres';
    }
  }
  
  getPasswordTextClass(): string {
    switch (this.passwordStrength()) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-600';
      case 4: return 'text-green-500';
      default: return 'text-gray-500';
    }
  }
  
  getButtonClass(): string {
    if (this.enviando()) {
      return 'bg-blue-400 cursor-not-allowed text-white';
    } else if (this.registroExitoso()) {
      return 'bg-green-500 text-white';
    } else if (this.formularioValido()) {
      return 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105';
    } else {
      return 'bg-gray-300 cursor-not-allowed text-gray-500';
    }
  }
  
  getMensajeClass(): string {
    const tipo = this.mensaje()?.tipo;
    return tipo === 'success' 
      ? 'bg-green-50 border border-green-200 text-green-800'
      : 'bg-red-50 border border-red-200 text-red-800';
  }
  
  onSubmit() {
    if (!this.formularioValido() || this.enviando()) return;
    
    this.enviando.set(true);
    this.mensaje.set(null);
    
    // Simula proceso de registro
    setTimeout(() => {
      this.enviando.set(false);
      this.registroExitoso.set(true);
      this.mensaje.set({
        tipo: 'success',
        texto: '¡Cuenta creada exitosamente! Revisa tu email para confirmar.'
      });
    }, 2000);
  }
}
```

**Cómo se aplica la heurística correctamente:**

1. **Progreso Visual**: Barra que muestra completitud del formulario
2. **Validación en Tiempo Real**: Feedback inmediato mientras el usuario escribe
3. **Estados del Botón**: Diferentes apariencias según el estado (deshabilitado, cargando, éxito)
4. **Indicadores Visuales**: Íconos de validación, medidor de fuerza de contraseña
5. **Mensajes Contextuales**: Información específica sobre errores y cómo corregirlos
6. **Animaciones de Transición**: Cambios suaves que comunican el estado del sistema

## 4. Consistencia y Estándares

### Crear el componente `consistencia-estandares.component.ts`

**HTML y TS sin aplicar la heurística:**

```typescript
// consistencia-estandares-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consistencia-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Panel de Control</h2>
      
      <!-- Botones inconsistentes -->
      <div class="space-y-4">
        <!-- Cada botón tiene estilo diferente para la misma acción -->
        <button class="bg-red-500 text-white px-6 py-2 rounded-full">
          GUARDAR PERFIL
        </button>
        
        <button class="border-2 border-blue-500 text-blue-500 px-4 py-3 rounded-none text-sm">
          Guardar Configuración
        </button>
        
        <button class="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-1 rounded-lg uppercase text-xs">
          💾 GUARDAR DATOS
        </button>
        
        <button class="bg-yellow-300 text-black px-3 py-4 rounded-sm normal-case">
          Guardar cambios
        </button>
      </div>
      
      <!-- Iconos inconsistentes para acciones similares -->
      <div class="mt-8 grid grid-cols-2 gap-4">
        <div class="p-4 border">
          <span class="text-2xl">🗑️</span>
          <p>Eliminar Usuario</p>
        </div>
        
        <div class="p-4 border">
          <span class="text-2xl">❌</span>
          <p>Borrar Archivo</p>
        </div>
        
        <div class="p-4 border">
          <span class="text-2xl">🚫</span>
          <p>Quitar Elemento</p>
        </div>
        
        <div class="p-4 border">
          <span class="text-2xl">💀</span>
          <p>Destruir Datos</p>
        </div>
      </div>
    </div>
  `
})
export class ConsistenciaMaloComponent {}
```

**¿Por qué no está aplicada la heurística?**
- Cada botón de "guardar" tiene diferente color, tamaño, forma y tipografía
- Iconos diferentes para acciones similares (eliminar/borrar/quitar)
- No hay un patrón visual consistente
- Los usuarios no pueden predecir cómo se verán elementos similares

### Mitigación - Versión Mejorada:

```typescript
// consistencia-estandares-bueno.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consistencia-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">⚙️</span>
        <h2 class="text-xl font-semibold">Panel de Control</h2>
      </div>
      
      <!-- Botones consistentes - mismo patrón para acciones similares -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium mb-3">Acciones de Guardar</h3>
        
        <!-- Todos los botones de guardar siguen el mismo patrón -->
        <button class="flex items-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <span class="mr-3">💾</span>
          Guardar Perfil
        </button>
        
        <button class="flex items-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <span class="mr-3">💾</span>
          Guardar Configuración
        </button>
        
        <button class="flex items-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <span class="mr-3">💾</span>
          Guardar Datos
        </button>
      </div>
      
      <!-- Acciones de eliminación - patrón consistente para acciones destructivas -->
      <div class="mt-8 grid grid-cols-2 gap-4">
        <h3 class="col-span-2 text-lg font-medium mb-3">Acciones de Eliminación</h3>
        
        <button class="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg transition-colors">
          <span class="text-2xl mb-2">🗑️</span>
          <span class="text-red-700 font-medium">Eliminar Usuario</span>
        </button>
        
        <button class="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg transition-colors">
          <span class="text-2xl mb-2">🗑️</span>
          <span class="text-red-700 font-medium">Eliminar Archivo</span>
        </button>
      </div>
    </div>
  `
})
export class ConsistenciaBuenoComponent {}
```

## 5. Prevención de Errores

### Crear el componente `prevencion-errores.component.ts`

**HTML y TS sin aplicar la heurística:**

```typescript
// prevencion-errores-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prevencion-malo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Transferencia Bancaria</h2>
      
      <!-- Sin validaciones preventivas -->
      <form (ngSubmit)="transfer()">
        <input 
          type="text" 
          [(ngModel)]="accountNumber" 
          name="account"
          placeholder="Número de cuenta"
          class="w-full p-3 border mb-4">
          
        <input 
          type="text" 
          [(ngModel)]="amount" 
          name="amount"
          placeholder="Cantidad"
          class="w-full p-3 border mb-4">
          
        <!-- Sin confirmación para acción crítica -->
        <button 
          type="submit"
          class="w-full bg-red-600 text-white p-3 rounded">
          Transferir Dinero
        </button>
      </form>
    </div>
  `
})
export class PrevencionMaloComponent {
  accountNumber = '';
  amount = '';
  
  transfer() {
    // Sin validaciones - permite errores críticos
    console.log('Transferencia realizada');
  }
}
```

**¿Por qué no está aplicada la heurística?**
- No valida formato de cuenta bancaria antes del envío
- Permite montos negativos o inválidos
- No hay confirmación para operación financiera crítica
- No previene errores comunes como doble clic

### Mitigación - Versión Mejorada:

```typescript
// prevencion-errores-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prevencion-bueno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">🏦</span>
        <h2 class="text-xl font-semibold">Transferencia Bancaria</h2>
      </div>
      
      <form (ngSubmit)="transfer()">
        <!-- Campo cuenta con validación en tiempo real -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Número de Cuenta Destino
          </label>
          <input 
            type="text" 
            [(ngModel)]="accountNumber" 
            name="account"
            (input)="validateAccount()"
            placeholder="0000-0000-0000-0000"
            maxlength="19"
            class="w-full p-3 border-2 rounded-lg transition-colors"
            [ngClass]="{
              'border-green-500 bg-green-50': accountValid() === true,
              'border-red-500 bg-red-50': accountValid() === false,
              'border-gray-300': accountValid() === null
            }">
          
          @if (accountValid() === false) {
            <div class="mt-2 flex items-center text-red-600 text-sm">
              <span class="mr-2">⚠️</span>
              El número de cuenta debe tener 16 dígitos
            </div>
          }
        </div>

        <!-- Campo monto con validaciones -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Monto a Transferir
          </label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-gray-500">$</span>
            <input 
              type="number" 
              [(ngModel)]="amount" 
              name="amount"
              (input)="validateAmount()"
              placeholder="0.00"
              min="0.01"
              max="10000"
              step="0.01"
              class="w-full p-3 pl-8 border-2 rounded-lg">
          </div>
          
          @if (amount > 5000) {
            <div class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center text-yellow-800 text-sm">
                <span class="mr-2">🚨</span>
                <strong>Monto Alto:</strong> Requiere confirmación adicional
              </div>
            </div>
          }
        </div>

        <!-- Botón con protección -->
        <button 
          type="submit"
          [disabled]="!readyToTransfer() || processing()"
          class="w-full p-4 rounded-lg font-semibold transition-all duration-200"
          [ngClass]="{
            'bg-blue-600 hover:bg-blue-700 text-white': readyToTransfer() && !processing(),
            'bg-gray-300 text-gray-500 cursor-not-allowed': !readyToTransfer() || processing()
          }">
          
          @if (processing()) {
            Procesando...
          } @else {
            🔒 Confirmar Transferencia
          }
        </button>
      </form>
    </div>
  `
})
export class PrevencionBuenoComponent {
  accountNumber = '';
  amount: number = 0;
  
  accountValid = signal<boolean | null>(null);
  processing = signal(false);
  
  validateAccount() {
    const cleaned = this.accountNumber.replace(/[^0-9]/g, '');
    if (cleaned.length <= 16) {
      const formatted = cleaned.replace(/(.{4})/g, '$1-').replace(/-$/, '');
      this.accountNumber = formatted;
    }
    this.accountValid.set(cleaned.length === 16);
  }
  
  validateAmount() {
    // Validación automática por HTML5 constraints
  }
  
  readyToTransfer(): boolean {
    return this.accountValid() === true && this.amount > 0 && this.amount <= 10000;
  }
  
  transfer() {
    if (!this.readyToTransfer()) return;
    
    const confirmMessage = this.amount > 5000 
      ? `¿Confirmar transferencia de $${this.amount}? MONTO ALTO - Esta acción no se puede deshacer.`
      : `¿Confirmar transferencia de $${this.amount}?`;
      
    if (confirm(confirmMessage)) {
      this.processing.set(true);
      setTimeout(() => {
        this.processing.set(false);
        alert('Transferencia completada');
      }, 2000);
    }
  }
}
```

## 6. Reconocimiento en Lugar de Recordar

### Crear el componente `reconocimiento-recordar.component.ts`

**HTML y TS sin aplicar la heurística:**

```typescript
// reconocimiento-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reconocimiento-malo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 class="text-xl mb-4">Configurar Pizza</h2>
      
      <!-- El usuario debe recordar códigos -->
      <form>
        <div class="mb-4">
          <label>Tamaño (S, M, L, XL):</label>
          <input type="text" [(ngModel)]="size" name="size" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-4">
          <label>Masa (TH=Thin, TK=Thick, ST=Stuffed):</label>
          <input type="text" [(ngModel)]="crust" name="crust" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-4">
          <label>Ingredientes (separados por comas):</label>
          <textarea [(ngModel)]="toppings" name="toppings" 
                   placeholder="Ej: pepperoni, mushrooms, olives..." 
                   class="w-full p-2 border rounded h-20"></textarea>
        </div>
        
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
          Ordenar Pizza
        </button>
      </form>
    </div>
  `
})
export class ReconocimientoMaloComponent {
  size = '';
  crust = '';
  toppings = '';
}
```

**¿Por qué no está aplicada la heurística?**
- El usuario debe recordar códigos de tamaño (S, M, L, XL)
- Debe memorizar abreviaciones de tipo de masa (TH, TK, ST)
- Tiene que escribir ingredientes en lugar de seleccionarlos visualmente
- No hay opciones predefinidas para elegir

### Mitigación - Versión Mejorada:

```typescript
// reconocimiento-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reconocimiento-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border">
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">🍕</span>
        <h2 class="text-xl font-semibold">Configurar tu Pizza</h2>
      </div>
      
      <!-- Selección visual de tamaño -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Tamaño</h3>
        <div class="grid grid-cols-4 gap-3">
          @for (sizeOption of sizeOptions; track sizeOption.value) {
            <button 
              (click)="selectSize(sizeOption.value)"
              class="flex flex-col items-center p-4 border-2 rounded-lg transition-all"
              [ngClass]="{
                'border-blue-500 bg-blue-50': selectedSize() === sizeOption.value,
                'border-gray-200 hover:border-gray-300': selectedSize() !== sizeOption.value
              }">
              <span class="text-2xl mb-2">{{ sizeOption.icon }}</span>
              <span class="font-medium">{{ sizeOption.name }}</span>
              <span class="text-sm text-gray-600">{{ sizeOption.price }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Selección visual de masa -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Tipo de Masa</h3>
        <div class="grid grid-cols-3 gap-3">
          @for (crustOption of crustOptions; track crustOption.value) {
            <button 
              (click)="selectCrust(crustOption.value)"
              class="flex flex-col items-center p-4 border-2 rounded-lg transition-all"
              [ngClass]="{
                'border-blue-500 bg-blue-50': selectedCrust() === crustOption.value,
                'border-gray-200 hover:border-gray-300': selectedCrust() !== crustOption.value
              }">
              <span class="text-2xl mb-2">{{ crustOption.icon }}</span>
              <span class="font-medium">{{ crustOption.name }}</span>
              <span class="text-sm text-gray-600 text-center">{{ crustOption.description }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Ingredientes con iconos visuales -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">
          Ingredientes 
          <span class="text-sm font-normal text-gray-600">({{ selectedToppings().length }} seleccionados)</span>
        </h3>
        <div class="grid grid-cols-3 md:grid-cols-4 gap-3">
          @for (topping of toppingOptions; track topping.value) {
            <button 
              (click)="toggleTopping(topping.value)"
              class="flex flex-col items-center p-3 border-2 rounded-lg transition-all relative"
              [ngClass]="{
                'border-green-500 bg-green-50': isSelected(topping.value),
                'border-gray-200 hover:border-gray-300': !isSelected(topping.value)
              }">
              
              @if (isSelected(topping.value)) {
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
              }
              
              <span class="text-xl mb-1">{{ topping.icon }}</span>
              <span class="text-xs font-medium text-center">{{ topping.name }}</span>
              <span class="text-xs text-gray-600">+${{ topping.price }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Resumen visual -->
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 class="font-semibold mb-2">Resumen de tu Pizza:</h4>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span>Tamaño: {{ getSelectedSizeName() }}</span>
            <span>${{ getSizePrice() }}</span>
          </div>
          <div class="flex justify-between">
            <span>Masa: {{ getSelectedCrustName() }}</span>
            <span>Incluido</span>
          </div>
          @if (selectedToppings().length > 0) {
            <div class="flex justify-between">
              <span>Ingredientes ({{ selectedToppings().length }}):</span>
              <span>${{ getToppingsPrice() }}</span>
            </div>
            <div class="text-xs text-gray-600 ml-4">
              {{ getSelectedToppingsNames() }}
            </div>
          }
          <hr class="border-gray-300">
          <div class="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${{ getTotal() }}</span>
          </div>
        </div>
      </div>

      <button 
        [disabled]="!canOrder()"
        class="w-full py-3 px-6 rounded-lg font-semibold transition-colors"
        [ngClass]="{
          'bg-green-600 hover:bg-green-700 text-white': canOrder(),
          'bg-gray-300 text-gray-500 cursor-not-allowed': !canOrder()
        }">
        🛒 Agregar al Carrito - ${{ getTotal() }}
      </button>
    </div>
  `
})
export class ReconocimientoBuenoComponent {
  selectedSize = signal('');
  selectedCrust = signal('');
  selectedToppings = signal<string[]>([]);

  sizeOptions = [
    { value: 'small', name: 'Personal', icon: '🍕', price: '$8.99' },
    { value: 'medium', name: 'Mediana', icon: '🍕', price: '$12.99' },
    { value: 'large', name: 'Grande', icon: '🍕', price: '$15.99' },
    { value: 'xlarge', name: 'Familiar', icon: '🍕', price: '$18.99' }
  ];

  crustOptions = [
    { value: 'thin', name: 'Delgada', icon: '🥖', description: 'Crujiente y ligera' },
    { value: 'thick', name: 'Gruesa', icon: '🍞', description: 'Suave y esponjosa' },
    { value: 'stuffed', name: 'Rellena', icon: '🧀', description: 'Con queso en el borde' }
  ];

  toppingOptions = [
    { value: 'pepperoni', name: 'Pepperoni', icon: '🍕', price: '1.50' },
    { value: 'mushrooms', name: 'Champiñones', icon: '🍄', price: '1.00' },
    { value: 'olives', name: 'Aceitunas', icon: '🫒', price: '1.00' },
    { value: 'peppers', name: 'Pimientos', icon: '🌶️', price: '1.00' },
    { value: 'onions', name: 'Cebollas', icon: '🧅', price: '0.75' },
    { value: 'tomatoes', name: 'Tomates', icon: '🍅', price: '1.00' },
    { value: 'cheese', name: 'Queso Extra', icon: '🧀', price: '2.00' },
    { value: 'ham', name: 'Jamón', icon: '🥓', price: '2.00' }
  ];

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  selectCrust(crust: string) {
    this.selectedCrust.set(crust);
  }

  toggleTopping(topping: string) {
    const current = this.selectedToppings();
    if (current.includes(topping)) {
      this.selectedToppings.set(current.filter(t => t !== topping));
    } else {
      this.selectedToppings.set([...current, topping]);
    }
  }

  isSelected(topping: string): boolean {
    return this.selectedToppings().includes(topping);
  }

  canOrder(): boolean {
    return this.selectedSize() !== '' && this.selectedCrust() !== '';
  }

  getSelectedSizeName(): string {
    const size = this.sizeOptions.find(s => s.value === this.selectedSize());
    return size ? size.name : '';
  }

  getSelectedCrustName(): string {
    const crust = this.crustOptions.find(c => c.value === this.selectedCrust());
    return crust ? crust.name : '';
  }

  getSizePrice(): number {
    const size = this.sizeOptions.find(s => s.value === this.selectedSize());
    return size ? parseFloat(size.price.replace('$', '')) : 0;
  }

  getToppingsPrice(): number {
    return this.selectedToppings().reduce((total, topping) => {
      const toppingObj = this.toppingOptions.find(t => t.value === topping);
      return total + (toppingObj ? parseFloat(toppingObj.price) : 0);
    }, 0);
  }

  getTotal(): string {
    return (this.getSizePrice() + this.getToppingsPrice()).toFixed(2);
  }

  getSelectedToppingsNames(): string {
    return this.selectedToppings()
      .map(t => this.toppingOptions.find(opt => opt.value === t)?.name)
      .filter(Boolean)
      .join(', ');
  }
}
```


## 7. Flexibilidad y Eficiencia de Uso

**Componente: `flexibilidad-eficiencia.component.ts`**
**Objetivo UX:** Permitir que tanto usuarios novatos como expertos puedan usar el sistema, ofreciendo atajos, configuraciones personalizadas y formas más rápidas de completar tareas frecuentes.

---

### Ejemplo Malo (NO aplica la heurística 7)

```typescript
// flexibilidad-malo.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flexibilidad-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Redactar Mensaje</h2>

      <!-- Interfaz rígida, misma experiencia para todos -->
      <textarea 
        [(ngModel)]="mensaje"
        class="w-full h-32 p-3 border rounded mb-4"
        placeholder="Escribe tu mensaje aquí...">
      </textarea>

      <!-- Solo un botón, sin atajos, sin opciones avanzadas -->
      <button 
        (click)="enviar()"
        class="w-full bg-blue-500 text-white p-3 rounded">
        Enviar Mensaje
      </button>

      <!-- Sin historial, sin plantillas, sin autocompletado -->
      <div class="mt-6 text-gray-600 text-sm">
        No hay opciones avanzadas disponibles.
      </div>
    </div>
  `
})
export class FlexibilidadMaloComponent {
  mensaje = '';

  enviar() {
    console.log('Mensaje enviado:', this.mensaje);
  }
}
```

#### Por qué NO aplica la heurística:

* No existen atajos ni funciones avanzadas para usuarios expertos.
* No permite configurar la experiencia (tema, tamaño del texto, plantillas).
* No ofrece autocompletado, historial o sugerencias.
* Es completamente rígido: todos los usuarios reciben la misma interfaz.

---

### Ejemplo Bueno (Sí aplica la heurística)

Este ejemplo introduce:

* Modo rápido de envío con atajos de teclado (Ctrl + Enter).
* Plantillas rápidas para usuarios avanzados.
* Autoguardado automático.
* Configuración de tamaño de texto.
* Vista simplificada o avanzada según preferencia del usuario.

```typescript
// flexibilidad-bueno.component.ts
import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flexibilidad-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg border">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <span class="text-2xl mr-3">⚡</span>
          <h2 class="text-xl font-semibold">Redacción Rápida con Flexibilidad</h2>
        </div>

        <!-- Modo experto -->
        <button 
          (click)="toggleModoExperto()"
          class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          [ngClass]="{
            'bg-blue-600 text-white border-blue-700': modoExperto(),
            'bg-gray-100 border-gray-300 text-gray-700': !modoExperto()
          }">
          {{ modoExperto() ? 'Modo Avanzado Activado' : 'Modo Avanzado Desactivado' }}
        </button>
      </div>

      <!-- Controles de personalización -->
      @if (modoExperto()) {
        <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-semibold mb-3">Ajustes Personalizados</h3>
          
          <div class="flex space-x-4 items-center">

            <div>
              <label class="text-sm text-gray-700">Tamaño de texto</label>
              <select 
                [(ngModel)]="tamanoTexto"
                class="p-2 border rounded ml-2">
                <option value="text-sm">Pequeño</option>
                <option value="text-base">Mediano</option>
                <option value="text-lg">Grande</option>
              </select>
            </div>

            <div>
              <label class="text-sm text-gray-700">Plantillas rápidas</label>
              <select 
                (change)="insertarPlantilla($event)"
                class="p-2 border rounded ml-2">
                <option value="">Seleccionar plantilla</option>
                <option value="saludo">Saludo Formal</option>
                <option value="recordatorio">Recordatorio</option>
                <option value="despedida">Despedida</option>
              </select>
            </div>
          </div>
        </div>
      }

      <!-- Área de texto -->
      <textarea
        [(ngModel)]="mensaje"
        (input)="autoGuardar()"
        class="w-full h-40 p-4 border-2 rounded-lg transition-all duration-200"
        [class]="tamanoTexto">
      </textarea>

      <div class="text-sm text-gray-600 mt-2">
        Último autoguardado: {{ ultimoGuardado() }}
      </div>

      <!-- Botones -->
      <div class="flex space-x-3 mt-4">

        <button 
          (click)="enviar()"
          class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">
          Enviar Mensaje
        </button>

        @if (modoExperto()) {
          <button 
            (click)="limpiar()"
            class="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold">
            Limpiar
          </button>
        }
      </div>

      <!-- Instrucciones de atajos -->
      @if (modoExperto()) {
        <div class="mt-4 p-3 bg-gray-100 border rounded text-sm text-gray-700">
          Atajos disponibles:
          <ul class="list-disc ml-6 mt-1">
            <li>Ctrl + Enter: Enviar mensaje</li>
            <li>Ctrl + L: Limpiar texto</li>
          </ul>
        </div>
      }

    </div>
  `
})
export class FlexibilidadBuenoComponent {
  mensaje = '';
  tamanoTexto = 'text-base';
  modoExperto = signal(false);
  ultimoGuardado = signal('Nunca');

  toggleModoExperto() {
    this.modoExperto.update(v => !v);
  }

  insertarPlantilla(event: any) {
    const value = event.target.value;

    const plantillas: any = {
      saludo: 'Estimado/a,\n\nEspero que se encuentre bien.\n',
      recordatorio: 'Recordatorio:\nNo olvide revisar el siguiente pendiente...\n',
      despedida: 'Saludos cordiales,\n\n'
    };

    if (plantillas[value]) {
      this.mensaje += '\n' + plantillas[value];
    }
  }

  autoGuardar() {
    const fecha = new Date().toLocaleTimeString();
    this.ultimoGuardado.set(fecha);
  }

  enviar() {
    alert('Mensaje enviado');
  }

  limpiar() {
    this.mensaje = '';
  }

  @HostListener('document:keydown', ['$event'])
  manejarAtajos(event: KeyboardEvent) {
    if (!this.modoExperto()) return;

    if (event.ctrlKey && event.key === 'Enter') {
      this.enviar();
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      this.limpiar();
    }
  }
}
```

----


## 8. Diseño Estético y Minimalista

**Componente: `diseno-estetico-minimalista.component.ts`**
**Objetivo UX:** Presentar únicamente la información relevante para la tarea actual, evitando sobrecargar visualmente al usuario. Interfaces limpias, ordenadas y con jerarquía clara mejoran la comprensión y reducen la carga cognitiva.

---

### Ejemplo Malo (NO aplica la heurística 8)

```typescript
// minimalismo-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minimalismo-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-3xl mx-auto bg-white rounded shadow border space-y-4">

      <h2 class="text-2xl font-bold underline italic text-red-600 mb-4">
        Panel de Usuario SUPER COMPLETO
      </h2>

      <!-- Exceso de elementos visuales -->
      <div class="grid grid-cols-3 gap-4">

        <div class="p-4 border-4 border-red-400 bg-yellow-200 rounded-xl">
          <h3 class="font-bold text-lg text-blue-800 underline">Sección 1</h3>
          <p class="text-sm">Información irrelevante que no se necesita ahora.</p>
          <button class="mt-2 bg-green-300 border border-black px-4 py-1 rounded-full">
            Botón A
          </button>
        </div>

        <div class="p-4 border-4 border-blue-400 bg-pink-200 rounded-xl shadow-xl">
          <h3 class="font-bold text-lg text-red-700 italic">Sección 2 Importante</h3>
          <ul class="list-disc pl-4 text-sm text-purple-800">
            <li>Dato 1</li>
            <li>Dato 2</li>
            <li>Dato 3 que podría estar oculto</li>
          </ul>
          <button class="mt-2 bg-orange-300 border-4 border-purple-700 px-4 py-1 rounded-full">
            Botón B
          </button>
        </div>

        <div class="p-4 border-4 border-green-400 bg-indigo-100 rounded-xl">
          <h3 class="font-bold text-lg text-indigo-800 underline italic">Sección 3</h3>
          <p class="text-sm">Demasiada información en un espacio pequeño.</p>
          <input type="text" class="border border-black p-1 w-full mt-2" placeholder="Escriba aquí">
          <button class="mt-2 bg-red-300 px-4 py-1 rounded">
            Botón C
          </button>
        </div>
      </div>

      <!-- Exceso de botones repetitivos -->
      <div class="flex space-x-3 mt-6">
        <button class="bg-red-500 text-white px-4 py-2 rounded">Guardar</button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Guardar Datos</button>
        <button class="bg-yellow-500 text-black px-4 py-2 rounded">Guardar Todo</button>
        <button class="bg-purple-500 text-white px-4 py-2 rounded">Guardar Formulario</button>
      </div>

    </div>
  `
})
export class MinimalismoMaloComponent {}
```

#### Por qué NO aplica la heurística:

* Colores excesivos y sin jerarquía.
* Tipografías inconsistentes y subrayados innecesarios.
* Demasiada información visible al mismo tiempo.
* Repetición de botones con la misma función.
* Falta de enfoque: no está claro qué debe hacer el usuario.

---

### Ejemplo Bueno (Sí aplica la heurística 8)

Este ejemplo usa:

* Jerarquía visual clara.
* Limpieza y eliminación de elementos irrelevantes.
* Estilo minimalista con TailwindCSS moderno.
* Uso de espacios, colores neutros y acciones principales destacadas.
* Secciones colapsables para evitar sobrecargar al usuario.

```typescript
// minimalismo-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minimalismo-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg border">

      <!-- Header limpio -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
          Panel de Usuario
        </h2>
        <p class="text-gray-600 mt-1">
          Gestiona tu información de forma clara y organizada.
        </p>
      </div>

      <!-- Tarjeta principal -->
      <div class="space-y-4">

        <!-- Información esencial -->
        <div class="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-800">Información Básica</h3>
          <p class="text-sm text-gray-600 mt-1">
            Solo los datos relevantes aparecen aquí.
          </p>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-700">Nombre</label>
              <input type="text"
                class="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su nombre">
            </div>

            <div>
              <label class="text-sm text-gray-700">Email</label>
              <input type="email"
                class="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com">
            </div>
          </div>
        </div>

        <!-- Sección avanzada colapsable -->
        <div class="border border-gray-200 rounded-lg">
          <button 
            (click)="toggleAvanzado()"
            class="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 flex justify-between items-center">
            <span class="font-medium text-gray-800">Opciones Avanzadas</span>
            <span class="text-xl">{{ avanzado() ? '−' : '+' }}</span>
          </button>

          <!-- Solo aparece si se activa -->
          @if (avanzado()) {
            <div class="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              <div>
                <label class="text-sm text-gray-700">Tema</label>
                <select class="w-full mt-1 p-2 border rounded-lg">
                  <option>Claro</option>
                  <option>Oscuro</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-gray-700">Notificaciones</label>
                <select class="w-full mt-1 p-2 border rounded-lg">
                  <option>Activadas</option>
                  <option>Desactivadas</option>
                </select>
              </div>
            </div>
          }
        </div>

      </div>

      <!-- Botón principal -->
      <div class="mt-8">
        <button
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Guardar Cambios
        </button>
      </div>

    </div>
  `
})
export class MinimalismoBuenoComponent {
  avanzado = signal(false);

  toggleAvanzado() {
    this.avanzado.update(v => !v);
  }
}
```



## 9. Reconocer, Diagnosticar y Recuperarse de Errores

**Componente: `errores-recuperacion.component.ts`**
**Objetivo UX:** El sistema debe ayudar al usuario a entender qué ocurrió, qué causó el error y cómo solucionarlo, usando mensajes claros, no técnicos, y con acciones de recuperación visibles.

---

### Ejemplo Malo (NO aplica la heurística 9)

```typescript
// errores-malo.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-errores-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Inicio de Sesión</h2>

      <input 
        type="text"
        placeholder="Usuario"
        [(ngModel)]="user"
        class="w-full p-2 border rounded mb-4">

      <input 
        type="password"
        placeholder="Contraseña"
        [(ngModel)]="password"
        class="w-full p-2 border rounded mb-4">

      <button 
        (click)="login()"
        class="w-full bg-blue-500 text-white p-2 rounded">
        Ingresar
      </button>

      <!-- Error técnico y sin ayuda -->
      @if (error()) {
        <div class="mt-4 p-3 bg-red-200 text-red-900 rounded">
          ERROR 401: BAD CREDENTIALS
        </div>
      }
    </div>
  `
})
export class ErroresMaloComponent {
  user = '';
  password = '';
  error = signal(false);

  login() {
    this.error.set(true);
    console.error('ERROR 401 - BAD CREDENTIALS');
  }
}
```

#### Por qué NO aplica la heurística:

* Muestra un mensaje técnico que el usuario no puede interpretar.
* No explica qué ocurrió.
* No ofrece pasos para solucionar el error.
* No permite recuperación (no hay botón de reintentar, ni ayuda, ni guía visual).
* Tono negativo y poco informativo.

---

### Ejemplo Bueno (Sí aplica la heurística 9)

Este ejemplo incorpora:

* Mensajes claros, naturales y sin tecnicismos.
* Ayuda contextual: qué ocurrió, por qué, cómo solucionarlo.
* Opciones de recuperación: reintentar, ver contraseña, restaurar cuenta.
* Validación en tiempo real para evitar errores antes de ocurrir.
* Estados visuales con TailwindCSS: rojo suave, borde destacado, íconos guía.

```typescript
// errores-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-errores-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border">

      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-900">Inicio de Sesión</h2>
        <p class="text-gray-600 text-sm mt-1">
          Ingresa tus credenciales para continuar.
        </p>
      </div>

      <!-- Usuario -->
      <div class="mb-4">
        <label class="text-sm text-gray-700">Usuario</label>
        <input 
          type="text"
          [(ngModel)]="user"
          (input)="validarUsuario()"
          class="w-full p-3 rounded-lg border-2 transition-all"
          [ngClass]="{
            'border-gray-300': estadoUsuario() === 'neutral',
            'border-red-500 bg-red-50': estadoUsuario() === 'error',
            'border-green-500 bg-green-50': estadoUsuario() === 'ok'
          }"
          placeholder="tu_usuario">
        
        <!-- Feedback -->
        @if (estadoUsuario() === 'error') {
          <p class="text-sm text-red-600 mt-1">
            El usuario debe tener al menos 3 caracteres.
          </p>
        }
      </div>

      <!-- Contraseña -->
      <div class="mb-4 relative">
        <label class="text-sm text-gray-700">Contraseña</label>
        <input 
          [type]="verPass() ? 'text' : 'password'"
          [(ngModel)]="password"
          class="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe tu contraseña">

        <!-- Botón de mostrar contraseña -->
        <button 
          (click)="toggleVerPass()"
          class="absolute right-3 top-10 text-gray-600 hover:text-gray-800">
          {{ verPass() ? 'Ocultar' : 'Ver' }}
        </button>
      </div>

      <!-- Botón principal -->
      <button 
        (click)="login()"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
        Ingresar
      </button>

      <!-- Mensaje de error con diagnóstico y soluciones -->
      @if (error()) {
        <div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start space-x-3">
            <span class="text-2xl">⚠️</span>
            <div>
              <p class="font-semibold text-red-800">No pudimos iniciar sesión</p>
              <p class="text-sm text-red-700 mt-1">
                Verifica tu usuario y contraseña. Asegúrate de que estén escritos correctamente.
              </p>

              <ul class="list-disc ml-5 text-sm text-red-700 mt-2 space-y-1">
                <li>Comprueba que no haya espacios al inicio o final.</li>
                <li>Revisa si tienes activado el bloqueo de mayúsculas.</li>
                <li>Si olvidaste tu contraseña, puedes restaurarla.</li>
              </ul>

              <!-- Acciones de recuperación -->
              <div class="flex space-x-3 mt-4">
                <button 
                  (click)="reintentar()"
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Reintentar
                </button>
                <button 
                  class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">
                  Recuperar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ErroresBuenoComponent {
  user = '';
  password = '';

  error = signal(false);
  verPass = signal(false);

  estadoUsuario = signal<'neutral' | 'error' | 'ok'>('neutral');

  validarUsuario() {
    if (this.user.length === 0) {
      this.estadoUsuario.set('neutral');
    } else if (this.user.length < 3) {
      this.estadoUsuario.set('error');
    } else {
      this.estadoUsuario.set('ok');
    }
  }

  toggleVerPass() {
    this.verPass.update(v => !v);
  }

  login() {
    if (this.user !== 'admin' || this.password !== '1234') {
      this.error.set(true);
    } else {
      alert('Inicio de sesión exitoso');
      this.error.set(false);
    }
  }

  reintentar() {
    this.error.set(false);
  }
}
```



## 10. Ayuda y Documentación

**Componente: `ayuda-documentacion.component.ts`**
**Objetivo UX:** El sistema debe ofrecer ayuda accesible, clara y contextual. Los usuarios deben poder encontrar instrucciones, ejemplos y soluciones sin salir de la interfaz ni perder el flujo de trabajo.

---

### Ejemplo Malo (NO aplica la heurística 10)

```typescript
// ayuda-malo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda-malo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-lg mx-auto p-6 bg-white rounded shadow border">
      <h2 class="text-xl font-semibold mb-4">Subir Documento</h2>

      <input 
        type="file"
        class="w-full p-2 border rounded mb-4"
      />

      <button class="w-full bg-blue-500 text-white p-3 rounded">
        Subir
      </button>

      <!-- Ayuda inexistente o inútil -->
      <div class="mt-6 text-sm text-gray-500">
        Para más información, consulte el Manual V3.2, Sección 9.4.21.
      </div>
    </div>
  `
})
export class AyudaMaloComponent {}
```

#### Por qué NO aplica la heurística:

* La ayuda no está disponible en el contexto donde el usuario la necesita.
* La referencia a un “manual V3.2 sección 9.4.21” es inútil e inaccesible.
* No explica pasos, ejemplos, ni soluciones.
* No hay accesos directos para problemas comunes.
* No ayuda al usuario a completar la tarea actual.

---

### Ejemplo Bueno (Sí aplica la heurística 10)

Este ejemplo incluye:

* Ayuda contextual en la misma pantalla.
* Preguntas frecuentes integradas.
* Instrucciones paso a paso.
* Posibilidad de mostrar/ocultar documentación avanzada.
* Sugerencias inteligentes según el estado del formulario.
* Uso de colores suaves, botones accesibles, paneles que guían.

```typescript
// ayuda-bueno.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda-bueno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg border">

      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
          Subir Documento
        </h2>
        <p class="text-gray-600 mt-1">
          Selecciona un archivo y revisa las instrucciones si necesitas ayuda.
        </p>
      </div>

      <input 
        type="file"
        (change)="validarArchivo($event)"
        class="w-full p-3 border rounded-lg mb-4"
      />

      <!-- Sugerencias según el estado -->
      @if (estado() === 'error-tipo') {
        <div class="p-3 bg-red-50 border border-red-200 text-red-700 rounded mb-4">
          Solo se permiten archivos PDF o DOCX.
        </div>
      }

      @if (estado() === 'error-peso') {
        <div class="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded mb-4">
          El archivo supera el tamaño máximo permitido (10 MB).
        </div>
      }

      <!-- Botón principal -->
      <button
        [disabled]="!archivoValido()"
        class="w-full py-3 rounded-lg font-semibold transition-colors"
        [ngClass]="{
          'bg-blue-600 text-white hover:bg-blue-700': archivoValido(),
          'bg-gray-300 text-gray-500 cursor-not-allowed': !archivoValido()
        }">
        Subir Archivo
      </button>

      <!-- Panel de ayuda contextual -->
      <div class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-800 text-lg">
            Ayuda y Documentación
          </h3>

          <button 
            (click)="toggleAyuda()"
            class="text-sm text-blue-600 hover:underline">
            {{ ayudaVisible() ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>

        @if (ayudaVisible()) {
          <div class="mt-4 space-y-6">

            <!-- Paso a paso -->
            <div>
              <h4 class="font-semibold text-gray-800">Cómo subir tu archivo</h4>
              <ol class="ml-6 list-decimal text-sm text-gray-700 mt-2 space-y-1">
                <li>Haz clic en el cuadro para seleccionar un archivo.</li>
                <li>Asegúrate de que el formato sea PDF o DOCX.</li>
                <li>Verifica que su peso sea menor a 10 MB.</li>
                <li>Haz clic en “Subir Archivo”.</li>
              </ol>
            </div>

            <!-- FAQs -->
            <div>
              <h4 class="font-semibold text-gray-800">Preguntas Frecuentes</h4>
              <div class="mt-2 space-y-3">

                <div class="p-3 bg-white border rounded">
                  <p class="font-medium text-gray-800">¿Qué formatos se permiten?</p>
                  <p class="text-sm text-gray-700">PDF y DOCX.</p>
                </div>

                <div class="p-3 bg-white border rounded">
                  <p class="font-medium text-gray-800">¿Cuál es el tamaño máximo?</p>
                  <p class="text-sm text-gray-700">10 MB.</p>
                </div>

                <div class="p-3 bg-white border rounded">
                  <p class="font-medium text-gray-800">¿Qué hago si el archivo no carga?</p>
                  <p class="text-sm text-gray-700">
                    Revisa tu conexión o intenta usar otro navegador.
                    También puedes contactar a soporte si el problema persiste.
                  </p>
                </div>

              </div>
            </div>

            <!-- Enlace de soporte -->
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-900">
                ¿Aún necesitas ayuda?  
                Contáctanos en soporte@ejemplo.com
              </p>
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class AyudaBuenoComponent {
  estado = signal<'ok' | 'error-tipo' | 'error-peso' | 'neutral'>('neutral');
  archivoValido = signal(false);
  ayudaVisible = signal(false);

  toggleAyuda() {
    this.ayudaVisible.update(v => !v);
  }

  validarArchivo(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.estado.set('neutral');
      this.archivoValido.set(false);
      return;
    }

    const tipoValido = 
      file.type === 'application/pdf' || 
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!tipoValido) {
      this.estado.set('error-tipo');
      this.archivoValido.set(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.estado.set('error-peso');
      this.archivoValido.set(false);
      return;
    }

    this.estado.set('ok');
    this.archivoValido.set(true);
  }
}
```

03-ui-componentes-estilos