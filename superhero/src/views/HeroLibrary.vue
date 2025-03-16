<template>
    <div class="hero-library">
      <NavBar />
      <h1 class="title">Bibliothèque des Héros</h1>
  
      <!-- Barre de recherche -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un héros..."
        class="search-bar"
      />
  
      <!-- Affichage des héros -->
      <div class="hero-grid">
        <div v-for="hero in filteredHeroes" :key="hero.id" class="hero-card">
          <img :src="hero.image.url" :alt="hero.name" class="hero-image" />
          <h2 class="hero-name">{{ hero.name }}</h2>
  
          <!-- Affichage des statistiques -->
          <div class="hero-stats">
            <div v-for="(value, key) in hero.powerstats" :key="key" class="stat">
              <span class="stat-name">{{ formatStatName(key) }}</span>
              <span class="stat-value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavBar from "@/components/NavBar.vue";
  import { ref, computed, onMounted } from "vue";
  
  export default {
    components: { NavBar },
    setup() {
      const heroes = ref([]); // Liste des héros
      const searchQuery = ref(""); // Champ de recherche
  
      // Récupération des héros depuis l'API Superhero
      const fetchHeroes = async () => {
        try {
          const heroIds = Array.from({ length: 50 }, (_, i) => i + 1); // 50 premiers héros
          const responses = await Promise.all(
            heroIds.map(id =>
              fetch(`https://superheroapi.com/api/YOUR_ACCESS_TOKEN/${id}`).then(res => res.json())
            )
          );
          heroes.value = responses;
        } catch (error) {
          console.error("Erreur lors de la récupération des héros :", error);
        }
      };
  
      // Filtrer les héros en fonction de la recherche
      const filteredHeroes = computed(() =>
        heroes.value.filter(hero =>
          hero.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
  
      // Formatage des noms de statistiques
      const formatStatName = stat => {
        const mapping = {
          intelligence: "Intelligence",
          strength: "Force",
          speed: "Vitesse",
          durability: "Durabilité",
          power: "Puissance",
          combat: "Combat"
        };
        return mapping[stat] || stat;
      };
  
      onMounted(fetchHeroes);
  
      return { heroes, searchQuery, filteredHeroes, formatStatName };
    }
  };
  </script>
  
  <style scoped>
  .hero-library {
    background-color: #101820;
    color: white;
    text-align: center;
    padding: 20px;
  }
  
  .title {
    font-size: 2.5em;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
  
  .search-bar {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    width: 300px;
    border: 2px solid #ccc;
    margin-bottom: 20px;
  }
  
  .hero-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .hero-card {
    background: rgba(0, 0, 0, 0.6);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .hero-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 15px rgba(255, 255, 255, 0.3);
  }
  
  .hero-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
  
  .hero-name {
    font-size: 1.5em;
    margin: 10px 0;
  }
  
  .hero-stats {
    margin-top: 10px;
    text-align: left;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
  
  .stat {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
  
  .stat-name {
    font-weight: bold;
    color: #ffd700;
  }
  
  .stat-value {
    font-weight: bold;
  }
  </style>
  