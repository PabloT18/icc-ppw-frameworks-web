<template>
  <header>
    <h1>Mi Aplicación Vue 3</h1>
    <nav>
      <RouterLink to="/">🏠 Inicio</RouterLink> |
      <RouterLink to="/perfil">👤 Perfil</RouterLink> |
      <RouterLink to="/perfil2">👥 Perfil 2</RouterLink>
    </nav>
  </header>

  <main>
    <!-- Aquí se cargan las páginas -->
    <RouterView @accionRealizada="registrarEvento" />
  </main>
</template>

<script setup lang="ts">
// No importamos HomePage directamente porque lo carga RouterView
// pero sí escuchamos su evento emitido
const registrarEvento = (evento: { tipo: string; valor: number; }) => {
  console.log(`Señal recibida: ${evento.tipo} | Valor: ${evento.valor}`)
}
</script>

<style scoped>
header {
  background-color: #42b883;
  color: white;
  padding: 1rem;
  text-align: center;
}
nav a {
  color: white;
  margin: 0 0.5rem;
  text-decoration: none;
}
nav a:hover {
  text-decoration: underline;
}
main {
  padding: 1rem;
}
</style>
