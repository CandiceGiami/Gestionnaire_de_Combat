<!-- Page FIGHT-->
 
<template>
    <div>
      <!-- Chargement sécurisé pour éviter les bugs -->
      <div v-if="loading">Chargement des héros...</div>
      <!-- Vérification que des héros existent avant d'afficher les composants -->
      <div v-else-if="heroes.length > 0">
        <AffichageHero />
        <FightScene />
      </div>
      <p v-else>Aucun héros disponible.</p>
    </div>
</template>

<script setup>
  import { computed, onMounted } from "vue";
  import { useHeroStore } from "@/stores/HeroStore";
  import AffichageHero from "@/components/AffichageHero.vue";
  import FightScene from "@/components/FightScene.vue";

  // Store des héros
  const heroStore = useHeroStore();

  // Variables
  const heroes = computed(() => heroStore.heroes);
  const loading = computed(() => heroStore.loading);

  // Chargement des héros
  onMounted(async () => {
    console.log("Chargement des héros...");
    try {
      await heroStore.fetchHeroes();
      console.log("Héros chargés");
    } catch (error) {
      console.error("Erreur lors du chargement des héros :", error);
    }
  });
</script>


<style scoped>
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
</style>
