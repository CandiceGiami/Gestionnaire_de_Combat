<template>
  <FightScene v-if="battleStarted" :player1="selectedPlayer1" :player2="selectedPlayer2" />
  <button class="fight-btn" :disabled="!canFight" @click="startFight">FIGHT!</button>
  <div class="hero-selection">
    <div class="player player-1">
      <div class="controls">
        <button class="search" @click="search('spider')">Recherche</button>
        <button class="filter">Filtre</button>
      </div>
      <div class="heroes">
        <HeroCard
          v-for="hero in heroes"
          :key="hero.id"
          :hero="hero"
          :isHovered="hoveredHero === hero.id"
          :isSelected="selectedPlayer1 === hero"
          @hover="hoveredHero = $event"
          @select="selectedPlayer1 = hero"
        />
      </div>
    </div>

    <div class="player player-2">
      <div class="controls right-aligned">
        <button class="search">Filtre</button>
        <button class="filter">Recherche</button>
      </div>
      <div class="heroes">
        <HeroCard
          v-for="hero in heroes"
          :key="hero.id"
          :hero="hero"
          :isHovered="hoveredHero === hero.id"
          :isSelected="selectedPlayer2 === hero"
          @hover="hoveredHero = $event"
          @select="selectedPlayer2 = hero"
        />
      </div>
    </div>
     
  </div>
</template>

<script>
import { useHeroStore } from "@/stores/HeroStore";
import { computed, onMounted, ref } from "vue";
import HeroCard from "@/components/HeroCard.vue";
import FightScene from "@/components/FightScene.vue";

export default {
  components: { HeroCard, FightScene },
  setup() {
    const heroStore = useHeroStore();
    const heroes = computed(() => heroStore.heroes);
    const hoveredHero = ref(null);
    const selectedPlayer1 = ref(null);
    const selectedPlayer2 = ref(null);
    const battleStarted = ref(false);

    const canFight = computed(() => selectedPlayer1.value && selectedPlayer2.value);

    const search = (query) => {
      heroStore.searchHeroes(query);
    };

    const startFight = () => {
  console.log("Selected Player 1:", selectedPlayer1.value ? JSON.stringify(selectedPlayer1.value, null, 2) : "null");
  console.log("Selected Player 2:", selectedPlayer2.value ? JSON.stringify(selectedPlayer2.value, null, 2) : "null");
  battleStarted.value = true;
};


    onMounted(() => {
      heroStore.searchHeroes("s");
    });

    return { heroes, search, hoveredHero, selectedPlayer1, selectedPlayer2, canFight, startFight, battleStarted };
  },
};
</script>
<style scoped>
.hero-selection {
  position: absolute; /* Remplace fixed par absolute */
  top: 78%; /* Place la liste au milieu de la page */
  left: 0;
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%); /* Ajuste pour bien centrer */
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

.player-1 .search,
.player-2 .search {
  background: #fff;
  color: black;
  padding: 12px 25px;
  
  font-size: 14px;
  border-radius: 20px;
  border: 2px solid #ccc;
  transition: background 0.3s, transform 0.3s;
  text-align: center;
  width: 250px;
  margin-left: 100px;
}

.player-1 .search:hover,
.player-2 .search:hover {
  background: #f0f0f0;
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

.player-1 .filter {
  background: navy;
  color: white;
}

.player-1 .filter:hover {
  background: #1a1a1a;
}

.player-2 .filter {
  background: red;
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
  background-color: rgba(0, 0, 0, 0.4); /* Finition matte */
  border-radius: 10px; /* Bords arrondis */
  border: 2px solid rgba(0, 0, 0, 0.4); /* Bordures de la même couleur que le fond */
 
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
  margin: 20px auto;
  padding: 15px 30px;
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

  