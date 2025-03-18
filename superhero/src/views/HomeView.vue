<template>
  <div>


    <!-- ✅ Chargement sécurisé pour éviter les bugs -->
    <div v-if="loading">Chargement des héros...</div>
    <div v-else-if="heroes.length > 0">
      <AffichageHero />
      <FightScene />
    </div>
    <p v-else>⚠️ Aucun héros disponible.</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useHeroStore } from '@/stores/HeroStore';
import AffichageHero from '@/components/AffichageHero.vue';
import FightScene from '@/components/FightScene.vue';

const heroStore = useHeroStore();
const heroes = computed(() => heroStore.heroes);
const loading = computed(() => heroStore.loading);

onMounted(() => {
  console.log("🔄 Chargement des héros...");
  heroStore.fetchHeroes(); // ✅ Nouvelle méthode adaptée à la nouvelle API
});
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
