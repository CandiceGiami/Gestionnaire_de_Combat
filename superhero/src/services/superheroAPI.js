import axios from 'axios';

const API_URL = 'https://akabab.github.io/superhero-api/api';

export const getAllHeroes = async () => {
  try {
    console.log('📡 Envoi de la requête à l’API...');
    const response = await axios.get(`${API_URL}/all.json`);
    console.log('✅ Réponse API reçue :', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des héros :', error);
    return [];
  }
};

export const getHeroById = async (id) => {
  try {
    console.log(`📡 Récupération du héros ID: ${id}`);
    const response = await axios.get(`${API_URL}/id/${id}.json`);
    console.log("✅ Héros récupéré :", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du héros ID ${id} :`, error);
    return null;
  }
};
