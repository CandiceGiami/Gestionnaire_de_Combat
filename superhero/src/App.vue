<script setup>
import HeroList from './components/HeroList.vue';
import NavBar from './components/NavBar.vue';

import affichageHero from './components/affichageHero.vue';



</script>

<template>
  
  <affichageHero/>
  <NavBar/>
  <HeroList/>
</template>

<style scoped>
h1 {
  color: white;
  text-align: center;
}
img {
  max-width: 300px;
  display: block;
  margin: 0 auto;
}
</style>
