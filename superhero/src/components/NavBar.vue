<template>
    <nav class="navbar">
      <ul>
        <li>
          <router-link to="/heroes" active-class="active" aria-label="Liste des héros">
            Liste des Héros
          </router-link>
        </li>
        <li>
          <router-link to="/" active-class="active" aria-label="Accueil">
            FIGHT ! 
          </router-link>
        </li>
        <li>
          <router-link to="/history" active-class="active" aria-label="Historique des combats">
            Historique des combats
          </router-link>
        </li>
        
      </ul>
    </nav>
  </template>
  
  <style>
  .navbar {
    background: #290f33a5; /* Légère transparence */
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5); /* Ombre sous le menu */
  }
  
  .navbar ul {
    list-style: none;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0;
    margin: 0;
  }
  
  .navbar li {
    display: inline;
  }
  
  .navbar .center {
    flex-grow: 1;
    text-align: center;
  }
  
  .navbar a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    padding: 8px 12px;
    transition: background 0.3s ease-in-out;
  }
  
  .navbar a:hover, .navbar .active {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    .navbar ul {
      flex-direction: column;
      text-align: center;
    }
    .navbar {
      padding: 10px;
    }
  }
  </style>