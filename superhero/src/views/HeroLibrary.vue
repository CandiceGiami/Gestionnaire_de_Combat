<template>
  <div class="hero-library">
    <!-- Titre stylisé -->
    <h1 class="title">Bibliothèque des Héros</h1>

    <!-- Barre de recherche et filtres -->
    <div class="controls">
      <input type="text" v-model="searchQuery" placeholder="Rechercher un héros..." class="search-input" />
      
      <select v-model="selectedPublisher" class="filter-dropdown">
        <option value="">Tous les éditeurs</option>
        <option v-for="publisher in publishers" :key="publisher" :value="publisher">{{ publisher }}</option>
      </select>

      <select v-model="sortOption" class="filter-dropdown">
        <option value="name-asc">Nom (A-Z)</option>
        <option value="name-desc">Nom (Z-A)</option>
        <option value="score-asc">Score (bas-haut)</option>
        <option value="score-desc">Score (haut-bas)</option>
      </select>
    </div>

    <!-- Grille des héros -->
    <div class="hero-grid">
      <HeroCard v-for="hero in filteredHeroes" :key="hero.id" :hero="hero" class="clickable-card" @click="showDetails(hero)" />
    </div>

    <HeroDetails v-if="selectedHero" :hero="selectedHero" @close="selectedHero = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useHeroStore } from "@/stores/HeroStore";
import HeroCard from "@/components/HeroCard.vue";
import HeroDetails from "@/components/HeroDetails.vue";

// 📌 Store des héros
const heroStore = useHeroStore();

// 🔍 Filtres & recherche
const searchQuery = ref("");
const selectedPublisher = ref("");
const sortOption = ref("name-asc");

// 📌 Héros sélectionné (affiché dans HeroDetails)
const selectedHero = ref(null);

// 🎯 Liste complète des héros
const heroes = computed(() => heroStore.heroes);

// 🎭 Liste des éditeurs uniques (pour le menu déroulant)
const publishers = computed(() => {
  const uniquePublishers = new Set(
    heroes.value.map((h) => h.biography.publisher).filter(Boolean)
  );
  return [...uniquePublishers].sort();
});

// 🏆 Calcul du score d’un héros
const calculateHeroScore = (hero) => {
  return (
    (parseInt(hero.powerstats.intelligence) || 0) +
    (parseInt(hero.powerstats.strength) || 0) +
    (parseInt(hero.powerstats.speed) || 0) +
    (parseInt(hero.powerstats.durability) || 0) +
    (parseInt(hero.powerstats.power) || 0) +
    (parseInt(hero.powerstats.combat) || 0)
  );
};

// 🔥 Filtrage & Tri des héros
const filteredHeroes = computed(() => {
  let result = [...heroes.value];

  // Filtre par recherche
  if (searchQuery.value) {
    result = result.filter((hero) =>
      hero.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filtre par éditeur
  if (selectedPublisher.value) {
    result = result.filter(
      (hero) => hero.biography.publisher === selectedPublisher.value
    );
  }

  // Tri des résultats
  result.sort((a, b) => {
    if (sortOption.value === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption.value === "name-desc") return b.name.localeCompare(a.name);
    
    const scoreA = calculateHeroScore(a);
    const scoreB = calculateHeroScore(b);

    if (sortOption.value === "score-asc") return scoreA - scoreB;
    if (sortOption.value === "score-desc") return scoreB - scoreA;

    return 0;
  });

  return result;
});

// 📌 Ouvre les détails d’un héros
const showDetails = (hero) => {
  selectedHero.value = hero;
};

// 🛠️ Charge les héros au montage si besoin
onMounted(() => {
  if (heroStore.heroes.length === 0) {
    heroStore.fetchHeroes();
  }
});
</script>


<style scoped>
/* ========== TITRE ========== */
.title {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #FFD700; /* Jaune façon Superhero */
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6);
  margin-bottom: 20px;
  letter-spacing: 2px;
}

/* ========== CONTROLES (Barre de recherche et filtres) ========== */
.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

/* Barre de recherche */
.search-input {
  padding: 12px;
  width: 250px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid rgba(255, 215, 0, 0.6);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  transform: scale(1.05);
}

/* Boutons déroulants pour les filtres */
.filter-dropdown {
  padding: 12px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid rgba(255, 215, 0, 0.6);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-dropdown:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: scale(1.05);
}

/* ========== GRILLE DES HÉROS ========== */
.hero-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 20px;
}

/* Animation légère sur la carte des héros */
.hero-card {
  width: 180px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s;
}

.hero-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 5px 20px rgba(255, 255, 255, 0.3);
}

/* ========== FILTRES & OPTIONS ========== */
.filter-dropdown {
  padding: 12px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid rgba(255, 215, 0, 0.6);
  background: rgba(0, 0, 0, 0.8); /* Fond noir semi-transparent */
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Effet au survol */
.filter-dropdown:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  transform: scale(1.05);
}

/* ======= OPTIONS DU SELECT ======= */
.filter-dropdown option {
  background-color: #111; /* Fond noir profond */
  color: white; /* Texte blanc */
  padding: 10px;
}

/* Style au survol des options */
.filter-dropdown option:hover {
  background-color: #333; /* Fond légèrement plus clair au hover */
}

/* Correction pour certains navigateurs qui affichent un fond par défaut */
.filter-dropdown option:checked {
  background-color: #222;
}

</style>