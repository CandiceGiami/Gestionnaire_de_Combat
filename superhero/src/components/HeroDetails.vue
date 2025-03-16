<template>
    <div v-if="hero" class="hero-details-overlay" @click.self="$emit('close')">
      <div class="hero-details-container">
        <button class="close-btn" @click="$emit('close')">&times;</button>
  
        <div class="hero-header">
          <img :src="hero.images.md" :alt="hero.name" class="hero-image" />
          <h2 class="hero-name">{{ hero.name }}</h2>
          <p class="publisher">{{ hero.biography.publisher || 'Inconnu' }} - {{ hero.biography.alignment || 'Neutre' }}</p>
        </div>
  
        <div class="hero-sections">
          <div class="hero-stats">
            <h3>Statistiques</h3>
            <ul>
              <li><strong>Intelligence:</strong> {{ hero.powerstats.intelligence }}</li>
              <li><strong>Force:</strong> {{ hero.powerstats.strength }}</li>
              <li><strong>Vitesse:</strong> {{ hero.powerstats.speed }}</li>
              <li><strong>Durabilité:</strong> {{ hero.powerstats.durability }}</li>
              <li><strong>Puissance:</strong> {{ hero.powerstats.power }}</li>
              <li><strong>Combat:</strong> {{ hero.powerstats.combat }}</li>
            </ul>
          </div>
  
          <div class="hero-details">
            <h3>Apparence</h3>
            <p><strong>Taille:</strong> {{ hero.appearance.height[1] || 'Inconnu' }}</p>
            <p><strong>Poids:</strong> {{ hero.appearance.weight[1] || 'Inconnu' }}</p>
            <p><strong>Cheveux:</strong> {{ hero.appearance.hairColor || 'Inconnu' }}</p>
            <p><strong>Yeux:</strong> {{ hero.appearance.eyeColor || 'Inconnu' }}</p>
          </div>
  
          <div class="hero-details">
            <h3>Biographie</h3>
            <p><strong>Nom complet:</strong> {{ hero.biography.fullName || 'Inconnu' }}</p>
            <p><strong>Alias:</strong> {{ hero.biography.aliases?.join(', ') || 'Aucun alias' }}</p>
            <p><strong>Lieu de naissance:</strong> {{ hero.biography.placeOfBirth || 'Inconnu' }}</p>
          </div>
  
          <div class="hero-details">
            <h3>Affiliations & Connexions</h3>
            <p><strong>Équipe:</strong> {{ hero.connections.groupAffiliation || 'Aucune' }}</p>
            <p><strong>Relations:</strong> {{ hero.connections.relatives || 'Aucune information' }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      hero: Object,
    },
    methods: {
      handleClose(event) {
        // Vérifie si l'élément cliqué est bien l'overlay et pas l'intérieur de la popup
        if (event.target.classList.contains("hero-details-overlay")) {
          this.$emit("close");
        }
      },
    },
  };
  </script>
  
  
  <style scoped>
  /* Overlay de fond pour la popup */
  .hero-details-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 20px;
  }
  
  /* Conteneur de la popup avec un max-height pour scroll */
  .hero-details-container {
    background: #1e1e1e;
    color: white;
    padding: 20px;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
    text-align: center;
    position: relative;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  /* Animation d'apparition */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Bouton de fermeture */
  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 28px;
    color: white;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
  }
  
  .close-btn:hover {
    color: red;
  }
  
  /* Image du héros */
  .hero-image {
    width: 120px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 10px;
    border: 3px solid white;
  }
  
  /* Nom du héros */
  .hero-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  /* Information de l'éditeur */
  .publisher {
    font-size: 14px;
    color: #bbb;
  }
  
  /* Section des statistiques */
  .hero-stats {
    margin-top: 15px;
  }
  
  .hero-stats h3,
  .hero-details h3 {
    text-align: left;
    margin-bottom: 10px;
    color: yellow;
    font-size: 18px;
    border-bottom: 2px solid yellow;
    padding-bottom: 5px;
  }
  
  /* Liste des stats */
  .hero-stats ul {
    list-style: none;
    padding: 0;
    text-align: left;
  }
  
  .hero-stats ul li {
    padding: 5px 0;
    border-bottom: 1px solid #555;
    font-size: 14px;
  }
  
  /* Section détails */
  .hero-details {
    margin-top: 15px;
    text-align: left;
  }
  
  .hero-details p {
    margin: 5px 0;
    font-size: 14px;
  }
  
  /* Ajout de colonnes pour organiser les informations */
  .hero-sections {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  </style>
  