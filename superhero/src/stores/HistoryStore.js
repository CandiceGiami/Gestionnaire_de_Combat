import { defineStore } from "pinia";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    fights: [],
    player1Wins: 0,
    player2Wins: 0
  }),
  actions: {
    addFight(winner, player1, player2, player1Score, player2Score) {
      const fight = {
        winner,
        player1,
        player2,
        player1Score,
        player2Score,
        date: new Date().toLocaleString(),
      };
      this.fights.unshift(fight);

      // Mise à jour du compteur de victoires
      if (winner.includes("Player 1")) {
        this.player1Wins++;
      } else {
        this.player2Wins++;
      }
    },
    resetHistory() {
      this.fights = [];
      this.player1Wins = 0;
      this.player2Wins = 0;
    }
  }
});
