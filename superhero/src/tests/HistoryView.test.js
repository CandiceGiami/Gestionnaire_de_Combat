import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, it, expect, vi,beforeEach } from "vitest";
import HistoryComponent from "../../src/views/HistoryView.vue";
import { createPinia, setActivePinia } from "pinia";
import { useHistoryStore } from "../stores/HistoryStore";


// Mock du store HeroStore pour éviter les requêtes réelles
vi.mock("@/stores/HeroStore", () => ({
  useHeroStore: () => ({ heroes: [], fetchHeroes: vi.fn() }) // Simule un store vide avec une fonction fictive pour `fetchHeroes`
}));

// Définition de la suite de tests pour `HistoryComponent`
describe("HistoryComponent", () => {

  // Avant chaque test, on réinitialise Pinia pour avoir un état propre du store
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Test : Vérifie si les scores des joueurs sont bien affichés
  it("affiche les scores des joueurs", async () => {
    // Initialisation du store et des scores
    const historyStore = useHistoryStore();
    historyStore.player1Wins = 3;
    historyStore.player2Wins = 5;

    // Rendu du composant
    await render(HistoryComponent);

    // Vérification de l'affichage des scores
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });

  // Test : Vérifie si la liste des combats est correctement affichée
  it("affiche la liste des combats", async () => {
    // Initialisation du store avec des combats fictifs
    const historyStore = useHistoryStore();
    historyStore.fights = [
      { player1: "Batman", player1Score: 10, player2: "Superman", player2Score: 8, winner: "Player 1", date: "2025-03-19" },
      { player1: "Iron Man", player1Score: 7, player2: "Thor", player2Score: 9, winner: "Player 2", date: "2025-03-18" }
    ];

    // Rendu du composant
    await render(HistoryComponent);

    // Vérification de l'affichage des noms et des dates de combats
    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.getByText("Superman")).toBeInTheDocument();
    expect(screen.getByText("Iron Man")).toBeInTheDocument();
    expect(screen.getByText("Thor")).toBeInTheDocument();
    expect(screen.getByText("2025-03-19")).toBeInTheDocument();
    expect(screen.getByText("2025-03-18")).toBeInTheDocument();
  });

  // Test : Vérifie si l'historique est réinitialisé lorsqu'on clique sur le bouton
  it("réinitialise l'historique lorsqu'on clique sur le bouton", async () => {
    // Initialisation du store avec un combat fictif
    const historyStore = useHistoryStore();
    historyStore.fights = [
      { player1: "Batman", player1Score: 10, player2: "Superman", player2Score: 8, winner: "Player 1", date: "2025-03-19" }
    ];
    // Mock de la fonction `resetHistory` pour vérifier si elle est appelée
    historyStore.resetHistory = vi.fn();

    // Rendu du composant
    await render(HistoryComponent);

    // Recherche du bouton de réinitialisation et simulation du clic
    const resetButton = screen.getByText("Réinitialiser l'historique");
    await fireEvent.click(resetButton);

    // Vérifie si la fonction `resetHistory` a bien été appelée
    expect(historyStore.resetHistory).toHaveBeenCalled();
  });
});