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
       <!-- Score-->
      <h3 :class="showResults ? getStatClass(player1Score, player2Score) : ''" class="score">
        Score: <span :class="{ 'white-text': !showResults }">{{ displayPlayer1Score }}</span>
      </h3>
    </div>

    <HeroCard :hero="player1" :isSelected="true" class="hero-card left floating" />

    <div class="vs-container">
      <p class="vs-text">VS</p>
      <p v-if="winnerText" class="victory-text">{{ winnerText }}</p>

       <!-- Bar de combat -->
      <div class="fight-bar-container">
        <div class="fight-bar" :style="{ background: fightBarColor, transition: 'background 0.3s ease-in-out' }">
          <div class="indicator" :style="indicatorStyle"></div>
        </div>
      </div>

       <!-- bouton reset -->
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
  import { useHistoryStore } from "@/stores/HistoryStore";

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
        indicatorWidth: "50%",
        isFinalizing: false,
        fightStarted: false,            // Indicateur pour savoir si le combat a été lancé
        finalizeTimeout: null,         // Référence du timeout de finalisation
        resultsTimeout: null,          // Référence du timeout d’affichage des résultats
        statInterval: null,            // Référence de l’intervalle d’animation des stats
        scoreInterval: null,           // Référence de l’intervalle d’animation des scores
        fightBarTimeouts: [],          // Tableau des timeouts de la fight-bar
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
      },
    },
    watch: {
      // Dès que les deux joueurs sont définis, on lance l'animation du combat
      player1(newVal) {
        if (newVal && this.player2 && !this.fightStarted) {
          this.fightStarted = true;
          this.startFightAnimation();
        }
      },
      player2(newVal) {
        if (newVal && this.player1 && !this.fightStarted) {
          this.fightStarted = true;
          this.startFightAnimation();
        }
      },
    },
    methods: {
      // Arrête tous les sons en cours
      stopAllSounds() {
        if (this.fightAudio) {
          this.fightAudio.pause();
          this.fightAudio.currentTime = 0;
          this.fightAudio = null;
          console.log("Arrêt de la musique de combat");
        }
        if (this.victoryAudio) {
          this.victoryAudio.pause();
          this.victoryAudio.currentTime = 0;
          this.victoryAudio = null;
          console.log("Arrêt de la musique de victoire");
        }
      },
      // Relance un combat proprement
      restartFight() {
        console.log("Restart cliqué : réinitialisation du combat en cours");
        this.stopAllSounds(); // Coupe les sons actuels
        // Annule les animations en cours (barre, scores, stats) du combat précédent
        if (this.finalizeTimeout) {
          clearTimeout(this.finalizeTimeout);
          this.finalizeTimeout = null;
        }
        if (this.resultsTimeout) {
          clearTimeout(this.resultsTimeout);
          this.resultsTimeout = null;
        }
        if (this.statInterval) {
          clearInterval(this.statInterval);
          this.statInterval = null;
        }
        if (this.scoreInterval) {
          clearInterval(this.scoreInterval);
          this.scoreInterval = null;
        }
        if (this.fightBarTimeouts && this.fightBarTimeouts.length) {
          this.fightBarTimeouts.forEach((timeout) => clearTimeout(timeout));
          this.fightBarTimeouts = [];
        }
        // Réinitialise les indicateurs et le texte de victoire
        this.winnerText = "";
        this.fightStarted = false;
        this.indicatorWidth = "50%";
        this.isFinalizing = false;
        this.showResults = false;
        this.fightBarColor = "red";
        this.$emit("restart"); // Émet un événement pour retourner à la sélection
        // Pas de relance automatique du combat pour éviter de redémarrer la musique
      },
      // Lancement du combat
      startFightAnimation() {
        this.stopAllSounds(); // S'assure qu'aucun son précédent ne continue
        // Démarre le son de combat
        this.fightAudio = new Audio("/sounds/fight.mp3");
        this.fightAudio.play();
        console.log("Musique de combat lancée");
        // Réinitialise l'état de l'animation
        this.indicatorWidth = "50%";
        this.isFinalizing = false;
        // Effet d'apparition de la scène
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
        // Lance les animations de stats, de scores et de la barre de combat
        this.animateStats();
        this.animateScores();
        this.animateFightBar();
        // Programme la finalisation de la fight-bar à 13s
        this.finalizeTimeout = setTimeout(() => {
          this.finalizeFightBar();
        }, 13000);
        // Affiche le vainqueur et enregistre le combat à 15s
        this.resultsTimeout = setTimeout(() => {
          this.showResults = true;
          this.displayWinner();
          this.saveFightToHistory();
        }, 15000);
      },
      // Animation des stats en direct
      animateStats() {
        this.statInterval = setInterval(() => {
          if (this.showResults) {
            clearInterval(this.statInterval);
            this.statInterval = null;
          }
          this.$forceUpdate();
        }, 100);
      },
      // Animation des scores avec des valeurs aléatoires
      animateScores() {
        this.scoreInterval = setInterval(() => {
          if (this.showResults) {
            clearInterval(this.scoreInterval);
            this.scoreInterval = null;
          }
          this.randomPlayer1Score = Math.floor(Math.random() * 600);
          this.randomPlayer2Score = Math.floor(Math.random() * 600);
        }, 100);
      },
      // Animation dynamique de la fight-bar
      animateFightBar() {
        let counter = 0;
        if(this.winnerColor=='red'){
          this.fightBarColor = "blue";
        }
        else{
          this.fightBarColor = "red";
        }
        this.isFinalizing = false;
        this.indicatorWidth = "50%";
        this.fightBarTimeouts = []; // Réinitialise les timeouts de barre de combat stockés
        console.log("Oscillation de la barre de combat lancée");
        const changeBar = () => {
          if (this.showResults || this.isFinalizing) return;
          let randomPercentage = 30 + Math.random() * 40; // pourcentage entre 30% et 70%
          this.indicatorWidth = `${randomPercentage}%`;
          counter++;
          if (counter < 40) {
            const t = setTimeout(changeBar, Math.random() * 400 + 100);
            this.fightBarTimeouts.push(t);
          }
        };
        // Démarre l'oscillation de la barre après une courte pause
        const firstTimeout = setTimeout(changeBar, 500);
        this.fightBarTimeouts.push(firstTimeout);
      },
      // Finalisation de la barre de combat (remplissage côté vainqueur)
      finalizeFightBar() {
        this.isFinalizing = true;
        this.indicatorWidth =
          this.player1Score > this.player2Score ? "100%" : "0%";
        this.fightBarColor = this.player1Score > this.player2Score ? "blue" : "red";
        console.log("Barre de combat finalisée du côté du vainqueur");
      },
      // Affichage du vainqueur avec le son de victoire
      displayWinner() {
        this.stopAllSounds(); // Coupe le son de combat avant de jouer le son de victoire
        this.victoryAudio = new Audio("/sounds/victoire.mp3");
        this.victoryAudio.play();
        console.log("Musique de victoire lancée");
        this.winnerText =
          this.player1Score > this.player2Score ? "Player 1 WIN" : "Player 2 WIN";
        console.log("Vainqueur :", this.winnerText);
      },
      // Enregistre le résultat du combat dans l’historique
      saveFightToHistory() {
        this.historyStore.addFight(
          this.winnerText,
          this.player1.name,
          this.player2.name,
          this.player1Score,
          this.player2Score
        );
        console.log(
          `Combat enregistré : ${this.player1.name} (${this.player1Score}) vs ${this.player2.name} (${this.player2Score}) - Vainqueur : ${this.winnerText}`
        );
      },
      // Style des barres de stats (largeur dynamique)
      getStatBarStyle(player, key) {
        return {
          width: this.showResults
            ? `${parseInt(this[player].powerstats[key]) || 0}%`
            : `${Math.floor(Math.random() * 100)}%`,
          background: "yellow",
          transition: this.showResults ? "width 1s ease-in-out" : "none",
        };
      },
      // Affichage des valeurs de stats (aléatoires ou finales)
      displayStatPlayer1(key) {
        return this.showResults
          ? this.player1.powerstats[key] || 0
          : Math.floor(Math.random() * 100);
      },
      displayStatPlayer2(key) {
        return this.showResults
          ? this.player2.powerstats[key] || 0
          : Math.floor(Math.random() * 100);
      },
      // Attribution des classes CSS aux stats pour colorer gagnant/perdant
      getStatClass(playerValue, opponentValue) {
        if (!this.showResults) return "";
        if ((parseInt(playerValue) || 0) > (parseInt(opponentValue) || 0))
          return "stat-win";
        if ((parseInt(playerValue) || 0) < (parseInt(opponentValue) || 0))
          return "stat-lose";
        return "";
      },
      // Calcule le score total (somme des powerstats) d'un héros
      calculateTotalScore(hero) {
        if (!hero || !hero.powerstats) return 0;
        return Object.values(hero.powerstats).reduce(
          (sum, val) => sum + (parseInt(val) || 0),
          0
        );
      },
    },
    // Arrête sons et animations si on quitte la scène
    beforeUnmount() {
      this.stopAllSounds();
      if (this.finalizeTimeout) clearTimeout(this.finalizeTimeout);
      if (this.resultsTimeout) clearTimeout(this.resultsTimeout);
      if (this.statInterval) clearInterval(this.statInterval);
      if (this.scoreInterval) clearInterval(this.scoreInterval);
      if (this.fightBarTimeouts && this.fightBarTimeouts.length) {
        this.fightBarTimeouts.forEach((timeout) => clearTimeout(timeout));
      }
      const scene = document.querySelector(".fight-scene");
      if (scene) scene.classList.remove("appear");
    },
    // Démarre le combat automatiquement si les joueurs sont déjà sélectionnés au montage du composant
    mounted() {
      if (this.player1 && this.player2) {
        this.startFightAnimation();
      }
    },
  };
</script>

<style scoped>
  /* ====================== STYLE DE LA SCÈNE ====================== */
  /* Apparition de la scène */
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
    margin: 10px; 
  }

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
    transition: width 1s ease-in-out;
  }

  /* ====================== COULEUR DES VALEURS ====================== */
  .stat-win {
    color: #4CAF50; 
    font-weight: bold;
  }

  .stat-lose {
    color: #FF4C4C; 
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

  /* Effet lumineux */
  @keyframes glow-effect {
    from {
      box-shadow: 0px 0px 15px rgba(255, 255, 0, 0.6);
    }
    to {
      box-shadow: 0px 0px 25px rgba(255, 255, 0, 1);
    }
  }

</style>
