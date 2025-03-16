<script setup>
import {  onMounted } from 'vue'
import { useHeroStore } from '@/stores/HeroStore'

const heroStore = useHeroStore()


// Fonction pour rechercher des héros

// Réinitialise les données au montage du composant
onMounted(() => {
  heroStore.clearHeroes()
})
</script>

<template>
  <div class="container"></div>
</template>

  
<style scoped>
  .hero-list {
    padding: 20px;
  }
  .search-bar, .filter-dropdown {
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
    font-size: 1rem;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    justify-content: center;
  }
  .hero-card {
    border: 1px solid #ccc;
    padding: 15px;
    text-align: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-image {
    max-width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
  }
  .info-btn {
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
    background: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background 0.3s;
  }
  .info-btn:hover {
    background: #0056b3;
  }
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  .close-btn {
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>