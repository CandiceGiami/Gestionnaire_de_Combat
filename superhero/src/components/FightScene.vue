<template>
  <div v-if="player1 && player2" class="fight-scene">
    <!-- Tableau des stats Player 1 -->
    <div class="stats-container player1-stats">
      <h3>Stats</h3>
      <div v-for="(stat, key) in player1.powerstats" :key="key" class="stat-row">
        <span>{{ key }}:</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="getStatBarStyle(player1.powerstats[key])"></div>
        </div>
        <span :class="getStatClass(player1.powerstats[key], player2.powerstats[key])">
          {{ player1.powerstats[key] || 0 }}
        </span>
      </div>
      <h3 :class="getStatClass(player1Score, player2Score)">Score: {{ player1Score }}</h3>
    </div>

    <HeroCard :hero="player1" :isSelected="true" class="hero-card left floating" />

    <div class="vs-container">
      <p class="vs-text">VS</p>

      <div class="fight-bar-container">
        <div class="fight-bar" :style="{ background: loserColor }">
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
          <div class="stat-fill" :style="getStatBarStyle(player2.powerstats[key])"></div>
        </div>
        <span :class="getStatClass(player2.powerstats[key], player1.powerstats[key])">
          {{ player2.powerstats[key] || 0 }}
        </span>
      </div>
      <h3 :class="getStatClass(player2Score, player1Score)">Score: {{ player2Score }}</h3>
    </div>
  </div>
</template>

<script>
import HeroCard from "@/components/HeroCard.vue";

export default {
  components: { HeroCard },
  props: {
    player1: Object,
    player2: Object,
  },
  computed: {
    totalScore() {
      return this.calculateTotalScore(this.player1) + this.calculateTotalScore(this.player2);
    },
    player1Score() {
      return this.calculateTotalScore(this.player1);
    },
    player2Score() {
      return this.calculateTotalScore(this.player2);
    },
    winnerColor() {
      return this.player1Score > this.player2Score ? "blue" : "red";
    },
    loserColor() {
      return this.winnerColor === "blue" ? "red" : "blue";
    },
    indicatorStyle() {
      const winnerScore = Math.max(this.player1Score, this.player2Score);
      const loserScore = Math.min(this.player1Score, this.player2Score);
      const percentage = winnerScore + loserScore > 0 ? (winnerScore / (winnerScore + loserScore)) * 100 : 50;

      return {
        width: `${percentage}%`,
        background: this.winnerColor,
        transition: "width 4s ease-in-out, background 4s ease-in-out",
        left: this.player1Score > this.player2Score ? "0%" : `${100 - percentage}%`,
      };
    }
  },
  methods: {
    restartFight() {
      this.$emit("restart"); // Réinitialisation du combat
    },
    startFightAnimation() {
      const leftHero = document.querySelector('.hero-card.left');
      const rightHero = document.querySelector('.hero-card.right');
      const fightBar = document.querySelector('.fight-bar');
      const stats = document.querySelectorAll('.stat-value');

      if (leftHero && rightHero && fightBar) {
        leftHero.classList.add('shake');
        rightHero.classList.add('shake');
        fightBar.classList.add('shake');
        stats.forEach(stat => stat.classList.add('shake'));

        setTimeout(() => {
          leftHero.classList.remove('shake');
          rightHero.classList.remove('shake');
          fightBar.classList.remove('shake');
          stats.forEach(stat => stat.classList.remove('shake'));
        }, 4500);
      }
    },
    getStatClass(playerValue, opponentValue) {
      if ((parseInt(playerValue) || 0) > (parseInt(opponentValue) || 0)) return "stat-win";
      if ((parseInt(playerValue) || 0) < (parseInt(opponentValue) || 0)) return "stat-lose";
      return "";
    },
    getStatBarStyle(value) {
      return {
        width: `${(parseInt(value) || 0)}%`,
        background: "yellow",
      };
    },
    calculateTotalScore(hero) {
      if (!hero || !hero.powerstats) return 0;
      return (
        (parseInt(hero.powerstats.intelligence) || 0) +
        (parseInt(hero.powerstats.strength) || 0) +
        (parseInt(hero.powerstats.speed) || 0) +
        (parseInt(hero.powerstats.durability) || 0) +
        (parseInt(hero.powerstats.combat) || 0) +
        (parseInt(hero.powerstats.power) || 0)
      );
    }
  },
  mounted() {
    this.startFightAnimation();
  }
};
</script>


<style scoped>
/* ====================== STYLE DE LA SCÈNE ====================== */
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


</style>
