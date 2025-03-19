import { defineStore } from "pinia";

// Définition du store "history" pour gérer l'historique des combats
export const useHistoryStore = defineStore("history", {

  state: () => ({
    fights: [],       // Liste des combats enregistrés
    player1Wins: 0,   // Nombre de victoires du joueur 1
    player2Wins: 0    // Nombre de victoires du joueur 2
  }),

  actions: {
    /**
     * Ajoute un combat à l'historique et met à jour le compteur de victoires
     * @param {string} winner - Vainqueur du combat ("Player 1" ou "Player 2")
     * @param {string} player1 - Nom du héros du joueur 1
     * @param {string} player2 - Nom du héros du joueur 2
     * @param {number} player1Score - Score du joueur 1
     * @param {number} player2Score - Score du joueur 2
     */
    addFight(winner, player1, player2, player1Score, player2Score) {
      const fight = {
        winner,
        player1,
        player2,
        player1Score,
        player2Score,
        date: new Date().toLocaleString(), // Enregistre la date du combat
      };
      this.fights.unshift(fight); // Ajoute le combat en début de liste

      // Mise à jour du compteur de victoires en fonction du vainqueur
      if (winner.includes("Player 1")) {
        this.player1Wins++;
      } else {
        this.player2Wins++;
      }
    },

    /**
     * Réinitialise complètement l'historique des combats
     * Remet les scores des joueurs à zéro
     */
    resetHistory() {
      this.fights = [];
      this.player1Wins = 0;
      this.player2Wins = 0;
    }
  }
});
