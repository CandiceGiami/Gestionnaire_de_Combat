import axios from 'axios';

const API_URL = '/api'; 

export const getHeroById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du héros :', error);
    return null;
  }
};

export const searchHeroes = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search/${query}`);
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    return [];
  }
};
