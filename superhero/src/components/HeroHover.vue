<template>
    <div class="hero-card">
      <!-- Détails affichés au hover -->
      <div v-if="isHovered" class="hero-details">
        <div class="stat">
          <span>Intelligence:</span>
          <div class="bar">
            <div
              class="progress"
              :style="{ '--progress-width': hero.powerstats.intelligence + '%' }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <span>Strength:</span>
          <div class="bar">
            <div
              class="progress"
              :style="{ '--progress-width': hero.powerstats.strength + '%' }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <span>Speed:</span>
          <div class="bar">
            <div
              class="progress"
              :style="{ '--progress-width': hero.powerstats.speed + '%' }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <span>Durability:</span>
          <div class="bar">
            <div
              class="progress"
              :style="{ '--progress-width': hero.powerstats.durability + '%' }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <span>Power:</span>
          <div class="bar">
            <div
              class="progress"
              :style="{ '--progress-width': hero.powerstats.power + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      hero: Object,
      isHovered: Boolean,
    },
  };
  </script>
  
  <style scoped>
  .hero-card {
    position: relative;
    width: 200px;
    transition: transform 0.3s ease-in-out;
    padding: 10px;
    background: #1e1e1e;
    color: white;
    border-radius: 10px;
    text-align: center;
    overflow: hidden;
  }
  
  .hero-card:hover {
    transform: scale(1.1);
  }
  
  .hero-details {
    padding: 10px;
    border-radius: 5px;
    margin: 5px 0;
  }
  
  .stat {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  
  .stat span {
    flex: 1;
    font-size: 14px;
  }
  
  .bar {
    flex: 3;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background: #ffcc00;
    animation: fillBar 1s ease-in-out forwards;
    width: 0;
    transition: width 0.5s ease-in-out;
  }
  
  /* Animation pour la barre de progression */
  @keyframes fillBar {
    from {
      width: 0;
    }
    to {
      width: var(--progress-width);
    }
  }
  .hero-card {
    display: none; /* Cache complètement l'élément */
  }
  
  .hero-card:hover  .hero-card {
    display: block; /* Affiche leas détails seulement au hover */
  }
  </style>
  