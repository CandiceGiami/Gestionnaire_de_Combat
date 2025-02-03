<script setup>
import { ref, onMounted } from 'vue';
import { getHeroById } from './services/superheroAPI';
import NavBar from './components/NavBar.vue';
import HeroList from './components/HeroList.vue';

const hero = ref(null);

onMounted(async () => {
  try {
    hero.value = await getHeroById(1);
  } catch (error) {
    console.error("Erreur lors du chargement du héros :", error);
  }
});
</script>

<template>
  <NavBar/>
  <div>
    <h1>Superhero Battle</h1>
    <div v-if="hero">
      <h2>{{ hero.name }}</h2>
      <img :src="hero.image.url" alt="Hero Image" />
      <p><strong>Intelligence :</strong> {{ hero.powerstats.intelligence }}</p>
      <p><strong>Force :</strong> {{ hero.powerstats.strength }}</p>
      <p><strong>Vitesse :</strong> {{ hero.powerstats.speed }}</p>
    </div>
  </div>
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
