import { defineStore } from 'pinia';
import { getAllHeroes, getHeroById } from '@/services/superheroAPI';

// Définition du store 
export const useHeroStore = defineStore('heroStore', {

  state: () => ({
    heroes: [],           // Liste des héros récupérés depuis l'API
    selectedHero: null,   // Héros actuellement sélectionné
    loading: false,       // Indicateur de chargement (utile pour afficher un loader)
    fetchError: null,     // Stocke un message d'erreur en cas d'échec de récupération des héros
  }),

  // Définition des actions (méthodes permettant d'interagir avec l'état)
  actions: {
    /**
     * Récupère la liste des héros depuis l'API
     * Met à jour l'état `heroes` et gère les erreurs en cas d'échec
     */
    async fetchHeroes() {
      this.loading = true; // Active l'indicateur de chargement
      this.fetchError = null; // Réinitialise l'erreur précédente (si existante)

      try {
        console.log("Requête pour récupérer les héros...");
        this.heroes = await getAllHeroes(); // Récupération des données via l'API
        console.log("Héros récupérés :", this.heroes);
      } catch (err) {
        console.error("Erreur lors de la récupération des héros :", err);
        this.fetchError = 'Impossible de récupérer les héros.'; // Message d'erreur utilisateur
      } finally {
        this.loading = false; //Désactive l'indicateur de chargement (succès ou erreur)
      }
    },

    /**
     * Récupère un héros spécifique par son ID
     * Met à jour `selectedHero` avec les données du héros
     * @param {number} id - Identifiant du héros à récupérer
     */
    async fetchHeroById(id) {
      this.loading = true; // Active l'indicateur de chargement

      try {
        console.log(`Récupération du héros avec l'ID: ${id}`);
        this.selectedHero = await getHeroById(id); //Appel API pour un seul héros
      } catch (err) {
        console.error(`Erreur lors de la récupération du héros ID ${id} :`, err);
      } finally {
        this.loading = false; // Désactive l'indicateur de chargement
      }
    },
  },
});
