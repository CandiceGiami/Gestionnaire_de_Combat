<script setup>
import { useHeroStore } from '@/stores/HeroStore'

const heroStore = useHeroStore()

const testStore = async () => {
  console.log('Test : Chargement des héros...')
  await heroStore.searchHeroes('batman') // Exemple de recherche
  console.log('Héros trouvés :', heroStore.heroes) // Affiche les héros dans la console
}
</script>

<template>
  <NavBar/>
  <div>
    <h1>Superhero Battle</h1>
    <div>
    <h1>Test du Store</h1>
    <button @click="testStore">Tester le Store</button>
    <div v-if="heroStore.loading">Chargement...</div>
    <ul v-if="heroStore.heroes.length">
      <li v-for="hero in heroStore.heroes" :key="hero.id">
        {{ hero.name }}
      </li>
    </ul>
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
