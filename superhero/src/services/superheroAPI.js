import axios from 'axios';

// URL de l'API des super-héros
const API_URL = 'https://akabab.github.io/superhero-api/api';

/**
 * Fonction pour récupérer tous les héros depuis l'API
 * @returns {Array} Liste des héros ou un tableau vide en cas d'erreur
 */

export const getAllHeroes = async () => {
  try {
    console.log('Envoi de la requête pour récupérer tous les héros...');
    
    // Envoi de la requête GET à l'API
    const response = await axios.get(`${API_URL}/all.json`);

    console.log('Réponse API reçue :', response.data.length, 'héros récupérés');

    return response.data; // Retourne les données des héros
  } catch (error) {
    console.error('Erreur lors de la récupération des héros :', error.message);
    return []; // Retourne un tableau vide en cas d'erreur pour éviter de casser l'application
  }
};


/**
 * Fonction pour récupérer un héros par son ID
 * @param {number} id - Identifiant du héros
 * @returns {Object|null} Données du héros ou `null` en cas d'erreur
 */

export const getHeroById = async (id) => {
  try {
    console.log(`Récupération du héros avec l'ID: ${id}...`);
    
    // Envoi de la requête GET pour un héros spécifique
    const response = await axios.get(`${API_URL}/id/${id}.json`);

    console.log('Héros récupéré :', response.data.name);

    return response.data; // Retourne les données du héros
  } catch (error) {
    console.error(`Erreur lors de la récupération du héros ID ${id} :`, error.message);
    return null; // Retourne `null` en cas d'erreur pour éviter les plantages
  }
};
