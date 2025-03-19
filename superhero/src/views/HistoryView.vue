<!-- Page Historique -->

<template>
  <div class="history-container">
    <h1>Historique des Combats</h1>

    <!-- Score des joueurs -->
    <div class="scoreboard">
      <div class="score-box player1-score">
        <span class="score-value">{{ historyStore.player1Wins }}</span>
        <span class="score-label">Player 1</span>
      </div>
      <div class="vs-divider">VS</div>
      <div class="score-box player2-score">
        <span class="score-value">{{ historyStore.player2Wins }}</span>
        <span class="score-label">Player 2</span>
      </div>
    </div>

    <!-- Liste des combats -->
    <div class="fight-history">
      <div 
        v-for="(fight, index) in historyStore.fights" 
        :key="index" 
        class="fight-card"
        :class="fight.winner.includes('Player 1') ? 'player1-background' : 'player2-background'"
      >
        <!-- Titre -->
        <div class="fight-header">
          <span class="winner-text">{{ fight.winner }} 🏆</span>
        </div>
        
        <div class="fight-content">
          <!-- Joueur 1 -->
          <div class="player player1">
            <img :src="getHeroImage(fight.player1)" alt="Player 1 Hero" class="hero-image" />
            <div class="player-info">
              <span class="hero-name">{{ fight.player1 }}</span>
              <span class="hero-score" :class="fight.player1Score > fight.player2Score ? 'winner-score' : 'loser-score'">
                {{ fight.player1Score }}
              </span>
            </div>
          </div>

          <!-- "VS" -->
          <div class="vs-container">
            <span class="vs-superhero">VS</span>
          </div>

          <!-- Joueur 2 -->
          <div class="player player2">
            <img :src="getHeroImage(fight.player2)" alt="Player 2 Hero" class="hero-image" />
            <div class="player-info">
              <span class="hero-name">{{ fight.player2 }}</span>
              <span class="hero-score" :class="fight.player2Score > fight.player1Score ? 'winner-score' : 'loser-score'">
                {{ fight.player2Score }}
              </span>
            </div>
          </div>
        </div>

        <div class="fight-footer">
          <span class="fight-date">{{ fight.date }}</span>
        </div>
      </div>
    </div>

    <!-- Bouton de réinitialisation -->
    <button class="reset-btn" @click="historyStore.resetHistory()">Réinitialiser l'historique</button>
  </div>
</template>

<script setup>
  import { onMounted } from "vue";
  import { useHistoryStore } from "@/stores/HistoryStore";
  import { useHeroStore } from "@/stores/HeroStore";


  const historyStore = useHistoryStore();
  const heroStore = useHeroStore();

  // Chargement des héros
  onMounted(() => {
    if (heroStore.heroes.length === 0) {
      heroStore.fetchHeroes();
    }
  });

  // Fonction pour récupérer l'image d'un héros par son nom
  const getHeroImage = (heroName) => {
    const hero = heroStore.heroes.find(
      (h) => h.name.toLowerCase() === heroName.toLowerCase()
    );
    return hero ? hero.images.md : null
  };

</script>


<style scoped>

/* Conteneur principal */
.history-container {
  text-align: center;
  padding: 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: 'Poppins', sans-serif;
}

/* Titre */
h1 {
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

/* Scoreboard */
.scoreboard {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 20px 0;
  align-items: center;
}

.winner-text{
  font-size: 24px;
  font-weight: bold;
  color: yellow;
  text-shadow: 2px 2px 15px rgba(255, 255, 0, 1);
  animation: glow 1.5s infinite alternate;
}
.score-box {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.player1-score {
  background: blue;
  color: white;
}

.player2-score {
  background: red;
  color: white;
}

.score-value {
  font-size: 40px;
}

.score-label {
  font-size: 14px;
}

/* VS */
.vs-divider {
  font-size: 32px;
  font-weight: bold;
  color: yellow;
  text-shadow: 2px 2px 8px rgba(255, 215, 0, 0.8);
  text-transform: uppercase;
}

/* Liste des combats */
.fight-history {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

/* Cartes des combats */
.fight-card {
  padding: 20px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-in-out;
}

/* Fond */
.player1-background {
  background: linear-gradient(to right, blue, rgb(0, 0, 128));
}

.player2-background {
  background: linear-gradient(to right, red, darkred);
}

/*  joueurs */
.fight-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}

.player {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* images */
.hero-image {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.5);
}

/*  Noms et Scores des heroes */
.hero-name {
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px; 
  text-align: center;
}

.hero-score {
  font-size: 22px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 8px;
  margin-top: 5px;
}

.winner-score {
  background: rgba(0, 255, 0, 0.8);
  box-shadow: 0px 4px 10px rgba(0, 255, 0, 0.4);
}

.loser-score {
  background: rgba(255, 0, 0, 0.8);
  box-shadow: 0px 4px 10px rgba(255, 0, 0, 0.4);
}

/* "VS" */
.vs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
}

.vs-superhero {
  font-size: 32px;
  font-weight: bold;
  color: yellow;
  text-shadow: 2px 2px 8px rgba(255, 215, 0, 0.8);
}

/* Bouton RESET*/
.reset-btn {
  margin-top: 30px;
  background: linear-gradient(to right, red, darkred);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 15px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  transition: 0.3s;
  box-shadow: 0px 4px 10px rgba(255, 0, 0, 0.4);
}
</style>
