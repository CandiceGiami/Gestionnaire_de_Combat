<template>
  <div id="app">
    <!-- Navigation -->
    <NavBar />

    <!-- Contenu dynamique -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style>
/* Applique une mise en page générale */
#app {
  font-family: Impact, Haettenschweiler, Arial Narrow Bold, sans-serif;
  text-align: center;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Le contenu est en dessous de la navbar */
main {
  flex: 1;
  margin-top: 60px; /* Ajuste selon la hauteur de ta navbar */
  padding: 20px;
}
</style>
