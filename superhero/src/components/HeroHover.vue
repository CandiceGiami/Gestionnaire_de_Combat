<template>
  <div class="hero-card">
    <!-- Détails affichés au hover -->
    <div v-if="isHovered && hero?.powerstats" class="hero-details">
      <div v-for="(stat, key) in powerstatsList" :key="key" class="stat">
        <span>{{ stat.label }}:</span>
        <div class="bar">
          <div
            class="progress"
            :style="{ width: (hero?.powerstats?.[key] || 0) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";

  // Déclaration des props
  const { hero, isHovered } = defineProps({
    hero: Object,
    isHovered: Boolean,
  });

  // Définition des statistiques des héros
  const powerstatsList = computed(() => ({
    intelligence: { label: "Intelligence" },
    strength: { label: "Strength" },
    speed: { label: "Speed" },
    durability: { label: "Durability" },
    power: { label: "Power" },
  }));
</script>
  
<style scoped>
  .hero-card {
    position: relative;
    width: 200px;
    transition: transform 0.3s ease-in-out;
    padding: 10px;
    background: #1e1e1e;
    color: white;
    border-radius: 10px;
    text-align: center;
    overflow: hidden;
  }
  
  .hero-card:hover {
    transform: scale(1.1);
  }
  
  .hero-details {
    padding: 10px;
    border-radius: 5px;
    margin: 5px 0;
  }
  
  .stat {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  
  .stat span {
    flex: 1;
    font-size: 14px;
  }
  
  .bar {
    flex: 3;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background: #ffcc00;
    animation: fillBar 1s ease-in-out forwards;
    width: 0;
    transition: width 0.5s ease-in-out;
  }
  
  /* Animation pour la barre de progression */
  @keyframes fillBar {
    from {
      width: 0;
    }
    to {
      width: var(--progress-width);
    }
  }

  .hero-card {
    display: none;
  }
  
   /* Affiche les détails seulement au hover */
  .hero-card:hover  .hero-card {
    display: block;
  }
</style>
  