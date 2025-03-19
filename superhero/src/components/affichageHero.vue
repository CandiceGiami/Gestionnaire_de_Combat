<template>
  <div class="particles"></div><div class="particles"></div><div class="particles"></div><div class="particles"></div><div class="particles"></div>
  <FightScene v-if="battleStarted" 
            :player1="selectedPlayer1" 
            :player2="selectedPlayer2" 
            @restart="battleStarted = false" />
  <h2 class="choose-hero">Choose your hero !</h2>
  <button class="fight-btn" :disabled="!canFight" @click="startFight">FIGHT!</button>
  <div class="particles"></div><div class="particles"></div>
  <div class="hero-selection">
    <div class="player player-1">
      <h2 class="txt_player">Player 1</h2>
      <div class="controls">
        <input 
          class="search-input" 
          type="text" 
          v-model="searchQueryPlayer1" 
          placeholder="Rechercher un héros..."
        />
        <div class="filter-wrapper">
          <button class="filter" @click="toggleFilterMenu('player1')">Filtres</button>
          <div v-if="showFilterMenuPlayer1" class="filter-menu">
            <button @click="sortHeroes('name', 'asc', 'player1')">Nom (A-Z)</button>
            <button @click="sortHeroes('name', 'desc', 'player1')">Nom (Z-A)</button>
            <button @click="sortHeroes('score', 'asc', 'player1')">Score (bas-haut)</button>
            <button @click="sortHeroes('score', 'desc', 'player1')">Score (haut-bas)</button>
          </div>
        </div>

      </div>

      <div class="heroes">
        <HeroCard
          v-for="hero in filteredHeroesPlayer1"
          :key="hero.id"
          :hero="hero"
          :isHovered="hoveredHero === hero.id"
          :isSelected="selectedPlayer1 === hero"
          :class="{ disabled: battleStarted }"
          @hover="!battleStarted ? (hoveredHero = $event) : null"
          @select="!battleStarted ? (selectedPlayer1 = hero) : null"
        />
      </div>
    </div>

    <div class="player player-2">
      <h2 class="txt_player">Player 2</h2>
      <div class="controls right-aligned">
        <input 
          class="search-input" 
          type="text" 
          v-model="searchQueryPlayer2" 
          placeholder="Rechercher un héros..."
        />
        <div class="filter-wrapper">
          <button class="filter" @click="toggleFilterMenu('player2')">Filtres</button>
          <div v-if="showFilterMenuPlayer2" class="filter-menu">
            <button @click="sortHeroes('name', 'asc', 'player2')">Nom (A-Z)</button>
            <button @click="sortHeroes('name', 'desc', 'player2')">Nom (Z-A)</button>
            <button @click="sortHeroes('score', 'asc', 'player2')">Score (bas-haut)</button>
            <button @click="sortHeroes('score', 'desc', 'player2')">Score (haut-bas)</button>
          </div>
        </div>
      </div>

      <div class="heroes">
        <HeroCard
          v-for="hero in filteredHeroesPlayer2"
          :key="hero.id"
          :hero="hero"
          :isHovered="hoveredHero === hero.id"
          :isSelected="selectedPlayer2 === hero"
          :class="{ disabled: battleStarted }"
          @hover="!battleStarted ? (hoveredHero = $event) : null"
          @select="!battleStarted ? (selectedPlayer2 = hero) : null"
        />
      </div>
    </div>
  </div>
</template>



<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useHeroStore } from "@/stores/HeroStore";
  import HeroCard from "@/components/HeroCard.vue";
  import FightScene from "@/components/FightScene.vue";

  const heroStore = useHeroStore();
  const heroes = computed(() => heroStore.heroes);

  // État pour la sélection des héros
  const hoveredHero = ref(null);
  const selectedPlayer1 = ref(null);
  const selectedPlayer2 = ref(null);
  const battleStarted = ref(false);

  // Détermine si on peut lancer le combat
  const canFight = computed(() => selectedPlayer1.value && selectedPlayer2.value);

  // Recherche et filtres
  const searchQueryPlayer1 = ref("");
  const searchQueryPlayer2 = ref("");
  const showFilterMenuPlayer1 = ref(false);
  const showFilterMenuPlayer2 = ref(false);

  // Fonction pour basculer l'affichage des filtres
  const toggleFilterMenu = (player) => {
    if (player === "player1") {
      showFilterMenuPlayer1.value = !showFilterMenuPlayer1.value;
      showFilterMenuPlayer2.value = false;
    } else {
      showFilterMenuPlayer2.value = !showFilterMenuPlayer2.value;
      showFilterMenuPlayer1.value = false;
    }
  };

  // Options de tri par défaut
  const sortOptionPlayer1 = ref({ type: "name", order: "asc" });
  const sortOptionPlayer2 = ref({ type: "name", order: "asc" });

  // Calcul du score d'un héros
  const calculateHeroScore = (hero) => {
    return (
      (parseInt(hero.powerstats.strength) || 0) +
      (parseInt(hero.powerstats.speed) || 0) +
      (parseInt(hero.powerstats.durability) || 0) +
      (parseInt(hero.powerstats.intelligence) || 0) +
      (parseInt(hero.powerstats.combat) || 0) +
      (parseInt(hero.powerstats.power) || 0)
    );
  };

  // Fonction de tri
  const sortFunction = (a, b, option) => {
    if (option.type === "name") {
      return option.order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (option.type === "score") {
      return option.order === "asc"
        ? calculateHeroScore(a) - calculateHeroScore(b)
        : calculateHeroScore(b) - calculateHeroScore(a);
    }
    return 0;
  };

  // Filtrage des héros en fonction de la recherche et du tri
  const filteredHeroes = (query, sortOption) => {
    return [...heroes.value]
      .filter((hero) =>
        hero.name.toLowerCase().includes(query.value.toLowerCase())
      )
      .sort((a, b) => sortFunction(a, b, sortOption.value));
  };

  const filteredHeroesPlayer1 = computed(() =>
    filteredHeroes(searchQueryPlayer1, sortOptionPlayer1)
  );
  const filteredHeroesPlayer2 = computed(() =>
    filteredHeroes(searchQueryPlayer2, sortOptionPlayer2)
  );

  // Met à jour les options de tri
  const sortHeroes = (type, order, player) => {
    if (player === "player1") {
      sortOptionPlayer1.value = { type, order };
    } else {
      sortOptionPlayer2.value = { type, order };
    }
  };

  // Fonction pour démarrer un combat
  const startFight = () => {
    if (selectedPlayer1.value && selectedPlayer2.value) {
      battleStarted.value = true;
    } else {
      console.warn("Impossible de démarrer le combat, sélectionnez deux héros !");
    }
  };

  // Charge les héros si nécessaire au montage du composant
  onMounted(() => {
    if (heroStore.heroes.length === 0) {
      console.log("Chargement des héros...");
      heroStore.fetchHeroes();
    } else {
      console.log("Héros déjà chargés, pas de nouvel appel API");
    }
  });

</script>

<style scoped>
  .txt_player {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
    text-align: center;
  }
  .choose-hero {
    font-size: 4em;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
    margin-top: 25%;
  }
  .hero-selection {
    position: absolute; 
    top: 85%;
    left: 0;
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
  }

  .player {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .player-1 {
    background: transparent;
  }

  .player-2 {
    background: transparent;
  }

  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .right-aligned {
    justify-content: flex-end;
  }

  .search-input {
    padding: 10px;
    font-size: 16px;
    border-radius: 20px;
    border: 2px solid #ccc;
    width: 250px;
    margin-left: 100px;
    transition: background 0.3s, transform 0.3s;
  }

  .player-1 .search-input:focus {
    outline: none;
    border-color: #007bff;
    transform: scale(1.05);
  }
  .player-2 .search-input:focus {
    outline: none;
    border-color: #ca1f1f;
    transform: scale(1.05);
  }

  .player-1 .filter,
  .player-2 .filter {
    padding: 12px 25px;
  
    font-size: 14px;
    border-radius: 20px;
    border: 2px solid #ccc;
    text-align: center;
    transition: background 0.3s, transform 0.3s;
    width: 200px;
    height: 50px;
    margin-right: 100px;
  }

  .filter-menu {
    position: absolute;
    background: white;
    border: 2px solid #ccc;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  .filter-menu button {
    background: none;
    border: none;
    padding: 8px;
    font-size: 14px;
    cursor: pointer;
    text-align: left;
  }

  .filter-menu button:hover {
    background: #f0f0f0;
  }


  .player-1 .filter {
    background: #1e3a5f;
    color: white;
  }

  .player-1 .filter:hover {
    background: #101f32;
  }

  .player-2 .filter {
    background: #c82b2b;
    color: white;
  }

  .player-2 .filter:hover {
    background: darkred;
  }

  .heroes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 10px;
  }

  .hero-card {
    text-align: center;
    padding: 15px;
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: rgba(0, 0, 0, 0.4); 
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.4);
  
  }

  .hero-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
  }

  .player-1 .hero-card {
    background: #1e3a5f;
  }

  .player-2 .hero-card {
    background: #c82b2b;
  }

  .hero-card img {
    width: 80%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .hero-card p {
    font-size: 16px;
    text-transform: capitalize;
  }

  .fight-btn {
    display: block;
    margin: 5px auto;
    padding: 10px 30px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    background: red;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    z-index: 1000;
  }

  .fight-btn:hover:enabled {
    background: darkred;
    transform: scale(1.1);
  }

  .fight-btn:disabled {
    background: gray;
    cursor: not-allowed;
  }
</style>

  