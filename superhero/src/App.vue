<template>
  <div id="app">
    <!-- Navigation -->
    <NavBar />

    <!-- Contenu dynamique de la page-->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style>
#app {
  font-family: Impact, Haettenschweiler, Arial Narrow Bold, sans-serif;
  text-align: center;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  margin-top: 60px;
  padding: 20px;
}
</style>
