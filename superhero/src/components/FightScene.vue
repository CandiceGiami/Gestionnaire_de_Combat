<template>
  <div v-if="player1 && player2" class="fight-scene animated">
    <!-- Tableau des stats Player 1 -->
    <div class="stats-container player1-stats">
      <h3>Stats</h3>
      <div v-for="(stat, key) in player1.powerstats" :key="key" class="stat-row">
        <span>{{ key }}:</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="getStatBarStyle('player1', key)"></div>
        </div>
        <span :class="showResults ? getStatClass(player1.powerstats[key], player2.powerstats[key]) : ''">
          {{ displayStatPlayer1(key) }}
        </span>
      </div>
      <h3 :class="showResults ? getStatClass(player1Score, player2Score) : ''" class="score">
        Score: <span :class="{ 'white-text': !showResults }">{{ displayPlayer1Score }}</span>
      </h3>
    </div>

    <HeroCard :hero="player1" :isSelected="true" class="hero-card left floating" />

    <div class="vs-container">
      <p class="vs-text">VS</p>
      <p v-if="winnerText" class="victory-text">{{ winnerText }}</p>

      <div class="fight-bar-container">
        <div class="fight-bar" :style="{ background: fightBarColor, transition: 'background 0.3s ease-in-out' }">
          <div class="indicator" :style="indicatorStyle"></div>
        </div>
      </div>

      <button class="restart-btn" @click="restartFight">Restart</button>
    </div>

    <HeroCard :hero="player2" :isSelected="true" class="hero-card right floating" />

    <!-- Tableau des stats Player 2 -->
    <div class="stats-container player2-stats">
      <h3>Stats</h3>
      <div v-for="(stat, key) in player2.powerstats" :key="key" class="stat-row">
        <span>{{ key }}:</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="getStatBarStyle('player2', key)"></div>
        </div>
        <span :class="showResults ? getStatClass(player2.powerstats[key], player1.powerstats[key]) : ''">
          {{ displayStatPlayer2(key) }}
        </span>
      </div>
      <h3 :class="showResults ? getStatClass(player2Score, player1Score) : ''" class="score">
        Score: <span :class="{ 'white-text': !showResults }">{{ displayPlayer2Score }}</span>
      </h3>
    </div>
  </div>
</template>

<script>
import HeroCard from "@/components/HeroCard.vue";
import { useHistoryStore } from "@/stores/HistoryStore"; // Import du store Pinia

export default {
  components: { HeroCard },
  props: {
    player1: Object,
    player2: Object,
  },
  data() {
    return {
      historyStore: useHistoryStore(), // Store d'historique
      winnerText: "",
      showResults: false,
      fightAudio: null,
      victoryAudio: null,
      randomPlayer1Score: 0,
      randomPlayer2Score: 0,
      fightBarColor: "red",
      indicatorWidth: "50%", // Position initiale
      isFinalizing: false, // Indique si l'animation finale est en cours
    };
  },
  computed: {
    player1Score() {
      return this.calculateTotalScore(this.player1);
    },
    player2Score() {
      return this.calculateTotalScore(this.player2);
    },
    displayPlayer1Score() {
      return this.showResults ? this.player1Score : this.randomPlayer1Score;
    },
    displayPlayer2Score() {
      return this.showResults ? this.player2Score : this.randomPlayer2Score;
    },
    winnerColor() {
      return this.player1Score > this.player2Score ? "blue" : "red";
    },
    indicatorStyle() {
      return {
        width: this.indicatorWidth,
        background: this.winnerColor,
        transition: this.isFinalizing ? "width 2s ease-in-out" : "width 1s ease-in-out",
      };
    }
  },
  methods: {
    // ✅ Arrête tous les sons en une seule fonction
    stopAllSounds() {
      if (this.fightAudio) {
        this.fightAudio.pause();
        this.fightAudio.currentTime = 0;
        this.fightAudio = null;
      }
      if (this.victoryAudio) {
        this.victoryAudio.pause();
        this.victoryAudio.currentTime = 0;
        this.victoryAudio = null;
      }
    },

    // ✅ Relance un combat proprement
    restartFight() {
      this.stopAllSounds(); // ✅ Arrête tous les sons avant de reset

      this.indicatorWidth = "50%"; // 🔥 Remet la barre au centre
      this.isFinalizing = false; // 🔥 Permet de refaire l'animation correctement
      this.showResults = false; // 🔥 Cache les résultats
      this.fightBarColor = "red"; // 🔥 Réinitialise la couleur de la barre

      this.$emit("restart"); // Émet un événement pour redémarrer la sélection

      setTimeout(() => {
        this.startFightAnimation(); // 🔥 Relance complètement l'animation
      }, 500); // Petite pause pour éviter un bug visuel
    },

    // ✅ Lancement du combat
    startFightAnimation() {
      this.stopAllSounds(); // ✅ Assure que rien ne joue en double

      this.fightAudio = new Audio("/sounds/fight.mp3");
      this.fightAudio.play();

      this.indicatorWidth = "50%"; // 🔥 Remet la barre au centre avant chaque combat
      this.isFinalizing = false; // 🔥 Permet de relancer l'animation

      const scene = document.querySelector(".fight-scene");
      if (scene) {
        scene.classList.add("appear");

        setTimeout(() => {
          scene.classList.add("shake");
          setTimeout(() => {
            scene.classList.remove("shake");
          }, 800);
        }, 500);
      }

      this.animateStats();
      this.animateScores();
      this.animateFightBar();

      // ⚡ La barre commence à se remplir doucement à 13s
      setTimeout(() => {
        this.finalizeFightBar();
      }, 13000);

      // ⚡ Affichage du vainqueur à 15s et enregistrement
      setTimeout(() => {
        this.showResults = true;
        this.displayWinner();
        this.saveFightToHistory();
      }, 15000);
    },

    // ✅ Animation des stats en live
    animateStats() {
      const interval = setInterval(() => {
        if (this.showResults) {
          clearInterval(interval);
        }
        this.$forceUpdate();
      }, 100);
    },

    // ✅ Animation des scores avec valeurs aléatoires
    animateScores() {
      const interval = setInterval(() => {
        if (this.showResults) {
          clearInterval(interval);
        }
        this.randomPlayer1Score = Math.floor(Math.random() * 600);
        this.randomPlayer2Score = Math.floor(Math.random() * 600);
      }, 100);
    },

    // ✅ Animation dynamique de la fight-bar
    animateFightBar() {
      let counter = 0;
      this.isFinalizing = false; // 🔥 Assure que l'animation peut bien repartir
      this.indicatorWidth = "50%"; // 🔥 Remet la barre au centre pour la relancer

      const changeBar = () => {
        if (this.showResults || this.isFinalizing) return; // 🔄 Stoppe l'animation une fois le combat fini

        let randomPercentage = 30 + Math.random() * 40; // Valeur entre 30% et 70%
        this.indicatorWidth = `${randomPercentage}%`;

        counter++;
        if (counter < 40) {
          setTimeout(changeBar, Math.random() * 400 + 100);
        }
      };

      setTimeout(changeBar, 500); // 🔥 Assure que l'animation démarre après une courte pause
    },

    // ✅ Finalisation de la barre de combat
    finalizeFightBar() {
      this.isFinalizing = true; // 🔥 Active une transition fluide
      this.indicatorWidth = this.player1Score > this.player2Score ? "100%" : "0%";
      this.fightBarColor = this.player1Score > this.player2Score ? "blue" : "red"; // 🔥 Change la couleur vers le gagnant
    },

    // ✅ Affichage du vainqueur avec le son
    displayWinner() {
      this.stopAllSounds(); // ✅ Assure que le son ne se superpose pas

      this.victoryAudio = new Audio("/sounds/victoire.mp3");
      this.victoryAudio.play();

      this.winnerText = this.player1Score > this.player2Score ? "Player 1 VICTORY" : "Player 2 VICTORY";
    },

    // ✅ Sauvegarde des résultats dans l’historique
    saveFightToHistory() {
      this.historyStore.addFight(
        this.winnerText,
        this.player1.name,
        this.player2.name,
        this.player1Score,
        this.player2Score
      );
    },

    // ✅ Style des barres de stats
    getStatBarStyle(player, key) {
      return {
        width: this.showResults
          ? `${(parseInt(this[player].powerstats[key]) || 0)}%`
          : `${Math.floor(Math.random() * 100)}%`,
        background: "yellow",
        transition: this.showResults ? "width 1s ease-in-out" : "none",
      };
    },

    // ✅ Affichage dynamique des stats
    displayStatPlayer1(key) {
      return this.showResults ? this.player1.powerstats[key] || 0 : Math.floor(Math.random() * 100);
    },
    displayStatPlayer2(key) {
      return this.showResults ? this.player2.powerstats[key] || 0 : Math.floor(Math.random() * 100);
    },

    // ✅ Couleurs des stats
    getStatClass(playerValue, opponentValue) {
      if (!this.showResults) return "";
      if ((parseInt(playerValue) || 0) > (parseInt(opponentValue) || 0)) return "stat-win";
      if ((parseInt(playerValue) || 0) < (parseInt(opponentValue) || 0)) return "stat-lose";
      return "";
    },

    // ✅ Calcul du score total d'un héros
    calculateTotalScore(hero) {
      if (!hero || !hero.powerstats) return 0;
      return Object.values(hero.powerstats).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    }
  },

  // ✅ Arrêt du son si on quitte la scène
  beforeUnmount() {
    this.stopAllSounds();
  },

  mounted() {
    if (this.player1 && this.player2) {
      this.startFightAnimation();
    }
  }
};
</script>



<style scoped>
/* ====================== STYLE DE LA SCÈNE ====================== */
/* Apparition animée de la scène */
.fight-scene {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100vw;
  height: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../assets/fight.png') no-repeat center center;
  background-size: cover;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  opacity: 0;
  transform: scale(0.8);
  transition: transform 0.7s ease-out, opacity 0.7s ease-out;
}

.fight-scene.appear {
  opacity: 1;
  transform: scale(1);
}

/* Effet de tremblement */
@keyframes scene-shake {
  0% { transform: translate(0px, 0px) rotate(0deg); }
  25% { transform: translate(-3px, 3px) rotate(-1deg); }
  50% { transform: translate(3px, -3px) rotate(1deg); }
  75% { transform: translate(-3px, 3px) rotate(-1deg); }
  100% { transform: translate(0px, 0px) rotate(0deg); }
}

.fight-scene.shake {
  animation: scene-shake 0.2s ease-in-out 3;
}

/* ====================== HERO CARDS ====================== */
.hero-card {
  width: 225px;
  height: 325px;
  border-radius: 15px;
  position: relative;
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid transparent;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.hero-card.left {
  border: 3px solid blue;
  box-shadow: 0px 0px 20px rgba(0, 0, 255, 0.6);
}

.hero-card.right {
  border: 3px solid red;
  box-shadow: 0px 0px 20px rgba(255, 0, 0, 0.6);
}

/* ====================== BARRE DE COMBAT ====================== */
.fight-bar-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 50px;
}

.fight-bar {
  width: 300px;
  height: 15px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
}

.loser-side {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: background 4s ease-in-out;
}

.indicator {
  height: 100%;
  position: absolute;
  transition: width 4s ease-in-out, background 4s ease-in-out, left 4s ease-in-out;
}

/* ====================== ANIMATIONS ====================== */
@keyframes scene-shake {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.05) rotate(2deg); }
  50% { transform: scale(0.95) rotate(-2deg); }
  75% { transform: scale(1.05) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes card-appear-left {
  0% { opacity: 0; transform: translateX(-400px) rotate(-40deg); }
  50% { opacity: 0.7; transform: translateX(-100px) rotate(10deg); }
  100% { opacity: 1; transform: translateX(0) rotate(0deg); }
}

@keyframes card-appear-right {
  0% { opacity: 0; transform: translateX(400px) rotate(40deg); }
  50% { opacity: 0.7; transform: translateX(100px) rotate(-10deg); }
  100% { opacity: 1; transform: translateX(0) rotate(0deg); }
}

/* ====================== VS TEXT ====================== */
.vs-container {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -20px;
}

.vs-text {
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 2px 2px 10px rgba(255, 255, 255, 0.8);
  color: yellow;
  text-transform: uppercase;
  animation: vs-flash 1s infinite alternate;
  margin-bottom: 10px;
}

/* ====================== CONTAINER DES STATS ====================== */
.stats-container {
  width: 220px;
  padding: 12px;
  background: rgba(20, 20, 20, 0.85);
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin: 10px; /* Marge pour éviter qu'elles collent trop aux bords */
}

/* Positionnement ajusté pour aligner avec les cartes */
.player1-stats {
  left: 5%;
}

.player2-stats {
  right: 5%;
}

/* ====================== BARRE DES STATS ====================== */
.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
}

.stat-bar {
  width: 100px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  display: inline-block;
  margin: 0 10px;
  position: relative;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.3);
}

.stat-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(to right, #FFD700, #FFDD44);
  border-radius: 6px;
  transition: width 1s ease-in-out; /* Animation douce */
}

/* ====================== COULEUR DES VALEURS ====================== */
.stat-win {
  color: #4CAF50; /* Vert vif */
  font-weight: bold;
}

.stat-lose {
  color: #FF4C4C; /* Rouge vif */
  font-weight: bold;
}

/* ====================== victoire ====================== */
.victory-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: bold;
  text-transform: uppercase;
  color: yellow;
  text-shadow: 0px 0px 10px rgba(255, 255, 0, 0.8), 0px 0px 20px rgba(255, 255, 0, 0.5);

  /* Fond semi-transparent avec effet lumineux */
  background: rgba(0, 0, 0, 0.7);
  padding: 20px 40px;
  border-radius: 15px;
  box-shadow: 0px 0px 15px rgba(255, 255, 0, 0.6);

  /* Animation d’apparition épique */
  animation: fade-in-scale 1s forwards, glow-effect 1.5s infinite alternate;
  opacity: 0;
  z-index: 100; /* Assure qu'il est bien au-dessus de tout */
}

/* Animation d'apparition avec léger zoom */
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Effet lumineux pulsant */
@keyframes glow-effect {
  from {
    box-shadow: 0px 0px 15px rgba(255, 255, 0, 0.6);
  }
  to {
    box-shadow: 0px 0px 25px rgba(255, 255, 0, 1);
  }
}

</style>
