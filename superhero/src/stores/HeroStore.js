import { defineStore } from 'pinia'
import { getHeroById, searchHeroes } from '@/services/superheroAPI'

export const useHeroStore = defineStore('heroStore', {
  state: () => ({
    heroes: [],
    selectedHero: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchHeroById(id) {
      this.loading = true
      this.error = null
      try {
        const hero = await getHeroById(id)
        this.selectedHero = hero
      } catch (err) {
        console.error('Erreur attrapée :', err) // Debug
        this.error = err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
      } finally {
        this.loading = false
      }
    },

    async searchHeroes(query) {
      this.loading = true
      this.error = null
      try {
        const heroes = await searchHeroes(query)
        this.heroes = heroes
      } catch (err) {
        console.error('Erreur attrapée :', err) // Debug
        this.error = err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
      } finally {
        this.loading = false
      }
    },
    actions: {
      clearHeroes() {
        this.heroes = []
      }
    }
  },
})
