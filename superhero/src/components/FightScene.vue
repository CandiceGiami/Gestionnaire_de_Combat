<template>
    <div v-if="player1 && player2" class="fight-scene">
      <HeroCard :hero="player1" :isSelected="true" class="hero-card left" />
      <div class="vs-container">
        <p class="vs-text">VS</p>
        <div class="fight-bar">
          <div class="indicator" :style="indicatorStyle"></div>
        </div>
      </div>
      <HeroCard :hero="player2" :isSelected="true" class="hero-card right" />
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
      winnerPosition() {
        if (!this.player1 || !this.player2) return 50;
        const player1Score = this.player1.powerstats.intelligence +
                             this.player1.powerstats.strength +
                             this.player1.powerstats.speed;
        const player2Score = this.player2.powerstats.intelligence +
                             this.player2.powerstats.strength +
                             this.player2.powerstats.speed;
  
        // On ajuste la position du gagnant ou l'égalité
        return player1Score === player2Score ? 50 : (player1Score > player2Score ? 30 : 70);
      },
      indicatorStyle() {
        const winnerScore = this.player1.powerstats.intelligence +
                            this.player1.powerstats.strength +
                            this.player1.powerstats.speed;
        const loserScore = this.player2.powerstats.intelligence +
                           this.player2.powerstats.strength +
                           this.player2.powerstats.speed;
  
        const leftColor = winnerScore > loserScore ? 'blue' : 'red';
        const rightColor = winnerScore < loserScore ? 'red' : 'blue';
  
        return {
          left: this.winnerPosition + '%',
          background: `linear-gradient(to right, ${leftColor} ${this.winnerPosition}%, ${rightColor} ${this.winnerPosition}%)`
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .fight-scene {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: calc(100vh - 50px - 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.9);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    z-index: 10;
    animation: scene-shake 0.4s ease-in-out; /* Animation plus rapide */
  }
  
  .hero-card {
    width: 220px;
    height: 300px;
    opacity: 0;
    transition: transform 0.4s ease-out, opacity 0.4s ease-out;
    border-radius: 20px; /* Ajout des coins arrondis */
  }
  
  .hero-card.left {
    transform: translateX(-300px) rotate(-20deg);
    animation: card-appear-left 0.5s forwards ease-in-out; /* Animation plus rapide */
  }
  
  .hero-card.right {
    transform: translateX(300px) rotate(20deg);
    animation: card-appear-right 0.5s forwards ease-in-out; /* Animation plus rapide */
  }
  
  .vs-container {
    text-align: center;
    color: white;
    font-size: 2.5rem;
    opacity: 1;
    animation: vs-shake 0.4s 0.2s forwards ease-in-out; /* Animation plus rapide pour le texte */
  }
  
  .vs-text {
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 2px 2px 10px rgba(255, 255, 255, 0.8);
  }
  
  .fight-bar {
    width: 250px;
    height: 10px;
    background: gray;
    position: relative;
    margin: 20px auto;
    border-radius: 5px;
    overflow: hidden;
    opacity: 1;
    animation: fight-bar-impact 0.5s 0.8s forwards ease-in-out; /* Impact plus rapide de la barre */
  }
  
  .indicator {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: left 0.5s ease-in-out, background 0.5s ease-in-out;
  }
  
  @keyframes scene-shake {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.05) rotate(2deg); }
    50% { transform: scale(0.95) rotate(-2deg); }
    75% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  
  @keyframes card-appear-left {
    0% {
      opacity: 0;
      transform: translateX(-400px) rotate(-40deg);
    }
    50% {
      opacity: 0.7;
      transform: translateX(-100px) rotate(10deg);
    }
    100% {
      opacity: 1;
      transform: translateX(0) rotate(0deg);
    }
  }
  
  @keyframes card-appear-right {
    0% {
      opacity: 0;
      transform: translateX(400px) rotate(40deg);
    }
    50% {
      opacity: 0.7;
      transform: translateX(100px) rotate(-10deg);
    }
    100% {
      opacity: 1;
      transform: translateX(0) rotate(0deg);
    }
  }
  
  @keyframes vs-shake {
    0% { transform: translateX(-5px); }
    25% { transform: translateX(5px); }
    50% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
    100% { transform: translateX(0); }
  }
  
  @keyframes fight-bar-impact {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  