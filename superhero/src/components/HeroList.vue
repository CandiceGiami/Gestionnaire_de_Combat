<template>
    <div class="hero-list">
      <!-- Barre de recherche -->
      <input v-model="searchQuery" type="text" placeholder="Rechercher un héros..." class="search-bar" />
      
      <!-- Filtres -->
      <select v-model="selectedFilter" class="filter-dropdown">
        <option value="all">Tous</option>
        <option value="strength">Force</option>
        <option value="speed">Vitesse</option>
        <option value="intelligence">Intelligence</option>
      </select>
      
      <!-- Liste des héros -->
      <div class="hero-grid">
        <div v-for="hero in filteredHeroes" :key="hero.id" class="hero-card">
          <img :src="hero.image.url" :alt="hero.name" class="hero-image" />
          <h3>{{ hero.name }}</h3>
          <button @click="showHeroDetails(hero)" class="info-btn">ℹ️</button>
        </div>
      </div>
  
      <!-- Pop-up d'information -->
      <div v-if="selectedHero" class="popup-overlay" @click="selectedHero = null">
        <div class="popup-content" @click.stop>
          <h2>{{ selectedHero.name }}</h2>
          <img :src="selectedHero.image.url" :alt="selectedHero.name" class="hero-popup-image" />
          <p><strong>Force:</strong> {{ selectedHero.powerstats.strength }}</p>
          <p><strong>Vitesse:</strong> {{ selectedHero.powerstats.speed }}</p>
          <p><strong>Intelligence:</strong> {{ selectedHero.powerstats.intelligence }}</p>
          <button @click="selectedHero = null" class="close-btn">Fermer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        heroes: [],
        searchQuery: '',
        selectedFilter: 'all',
        selectedHero: null
      };
    },
    computed: {
      filteredHeroes() {
        return this.heroes.filter(hero => 
          hero.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          (this.selectedFilter === 'all' || hero.powerstats[this.selectedFilter] > 50)
        );
      }
    },
    methods: {
      async fetchHeroes() {
        try {
          const response = await axios.get('https://superheroapi.com/api/YOUR_API_KEY/search/a');
          this.heroes = response.data.results;
        } catch (error) {
          console.error('Erreur lors du chargement des héros:', error);
        }
      },
      showHeroDetails(hero) {
        this.selectedHero = hero;
      }
    },
    mounted() {
      this.fetchHeroes();
    }
  };
  </script>
  
  <style>
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