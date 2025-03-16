import { defineStore } from 'pinia';
import { getAllHeroes, getHeroById } from '@/services/superheroAPI';

export const useHeroStore = defineStore('heroStore', {
  state: () => ({
    heroes: [],
    selectedHero: null, // Pour stocker un héros sélectionné
    loading: false,
    fetchError: null,
  }),
  actions: {
    async fetchHeroes() {
      this.loading = true;
      this.fetchError = null;
      try {
        console.log("📡 Requête pour récupérer les héros...");
        this.heroes = await getAllHeroes();
        console.log("✅ Héros récupérés :", this.heroes);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des héros :", err);
        this.fetchError = 'Impossible de récupérer les héros.';
      } finally {
        this.loading = false;
      }
    },

    async fetchHeroById(id) {
      this.loading = true;
      try {
        this.selectedHero = await getHeroById(id);
      } catch (err) {
        console.error(`❌ Erreur lors de la récupération du héros ID ${id} :`, err);
      } finally {
        this.loading = false;
      }
    },
  },
});
