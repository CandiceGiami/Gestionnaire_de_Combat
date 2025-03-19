import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, it, expect, vi,beforeEach } from "vitest";
import HistoryComponent from "../../src/views/HistoryView.vue";
import { createPinia, setActivePinia } from "pinia";
import { useHistoryStore } from "../stores/HistoryStore";


vi.mock("@/stores/HeroStore", () => ({
  useHeroStore: () => ({ heroes: [], fetchHeroes: vi.fn() })
}));

describe("HistoryComponent", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("affiche les scores des joueurs", async () => {
    const historyStore = useHistoryStore();
    historyStore.player1Wins = 3;
    historyStore.player2Wins = 5;

    await render(HistoryComponent);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });

  it("affiche la liste des combats", async () => {
    const historyStore = useHistoryStore();
    historyStore.fights = [
      { player1: "Batman", player1Score: 10, player2: "Superman", player2Score: 8, winner: "Player 1", date: "2025-03-19" },
      { player1: "Iron Man", player1Score: 7, player2: "Thor", player2Score: 9, winner: "Player 2", date: "2025-03-18" }
    ];

    await render(HistoryComponent);

    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.getByText("Superman")).toBeInTheDocument();
    expect(screen.getByText("Iron Man")).toBeInTheDocument();
    expect(screen.getByText("Thor")).toBeInTheDocument();
    expect(screen.getByText("2025-03-19")).toBeInTheDocument();
    expect(screen.getByText("2025-03-18")).toBeInTheDocument();
  });

  it("réinitialise l'historique lorsqu'on clique sur le bouton", async () => {
    const historyStore = useHistoryStore();
    historyStore.fights = [
      { player1: "Batman", player1Score: 10, player2: "Superman", player2Score: 8, winner: "Player 1", date: "2025-03-19" }
    ];
    historyStore.resetHistory = vi.fn();

    await render(HistoryComponent);
    const resetButton = screen.getByText("Réinitialiser l'historique");
    await fireEvent.click(resetButton);

    expect(historyStore.resetHistory).toHaveBeenCalled();
  });
});