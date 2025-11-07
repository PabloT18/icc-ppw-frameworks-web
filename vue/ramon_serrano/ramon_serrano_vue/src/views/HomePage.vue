<script setup lang="ts">
import { ref, defineEmits } from 'vue'

// 1️⃣ Definimos el evento personalizado "accionRealizada"
const emit = defineEmits(['accionRealizada'])

// 2️⃣ Creamos el contador reactivo
const contador = ref(0)

// 3️⃣ Una sola función para manejar todas las acciones
const manejarAccion = (accion: string) => {
  if (accion === 'incrementar') contador.value++
  else if (accion === 'decrementar' && contador.value > 0) contador.value--
  else if (accion === 'reiniciar') contador.value = 0

  // 4️⃣ Emitimos el evento con la acción y el valor actual del contador
  emit('accionRealizada', {
    tipo: accion,
    valor: contador.value,
    fecha: new Date().toLocaleTimeString()
  })
}
</script>

<template>
  <div class="home">
    <h1>🧮 Contador Vue 3</h1>
    <p>Valor actual: {{ contador }}</p>

    <div class="botones">
      <button @click="manejarAccion('incrementar')">➕ Incrementar</button>
      <button @click="manejarAccion('decrementar')">➖ Decrementar</button>
      <button @click="manejarAccion('reiniciar')">🔁 Reiniciar</button>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 2rem;
}
.botones {
  margin-top: 1rem;
}
button {
  margin: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #42b883;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background-color: #2f9e6e;
}
</style>
