import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HeroSelection from '../components/AffichageHero.vue'; // Assurez-vous que le chemin est correct
import { useHeroStore } from "../../src/stores/HeroStore";
import HeroCard from '../../src/components/HeroCard.vue';
import FightScene from '../../src/components/FightScene.vue';
import { createPinia, setActivePinia } from 'pinia';
// Mock du store HeroStore
vi.mock('@/stores/HeroStore');

describe('HeroSelection.vue', () => {
  let wrapper;
  let pinia;

  beforeEach(() => {
    // Mock HTMLMediaElement.prototype.play et pause
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();

    // Créer une instance de Pinia et l'activer
    pinia = createPinia();
    setActivePinia(pinia);

    // Mock du HeroStore pour tester
    useHeroStore.mockReturnValue({
      heroes: [
        {
          id: 1,
          name: 'Hero 1',
          powerstats: {
            intelligence: '80',
            strength: '90',
            speed: '85',
            durability: '80',
            power: '75',
            combat: '70',
          },
          images: {
            md: 'path/to/hero1-image.jpg',
          },
        },
        {
          id: 2,
          name: 'Hero 2',
          powerstats: {
            intelligence: '60',
            strength: '75',
            speed: '80',
            durability: '70',
            power: '65',
            combat: '60',
          },
          images: {
            md: 'path/to/hero2-image.jpg',
          },
        },
      ],
      fetchHeroes: vi.fn(),
    });

    // Monter le composant avec Pinia
    wrapper = mount(HeroSelection, {
      global: {
        plugins: [pinia], // Ajouter Pinia comme plugin
        components: {
          HeroCard,
          FightScene,
        },
      },
    });
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.choose-hero').text()).toBe('Choose your hero !');
    expect(wrapper.find('.fight-btn').exists()).toBe(true);
  });

  it('disables the fight button when no heroes are selected', () => {
    const fightButton = wrapper.find('.fight-btn');
    expect(fightButton.attributes('disabled')).toBeDefined();
  });

  it('enables the fight button when both heroes are selected', async () => {
    // Simuler la sélection des héros
    wrapper.vm.selectedPlayer1 = wrapper.vm.heroes[0];
    wrapper.vm.selectedPlayer2 = wrapper.vm.heroes[1];
    await wrapper.vm.$nextTick();

    const fightButton = wrapper.find('.fight-btn');
    expect(fightButton.attributes('disabled')).toBeUndefined();
  });

  it('starts the battle when the fight button is clicked', async () => {
    // Simuler la sélection des héros
    wrapper.vm.selectedPlayer1 = wrapper.vm.heroes[0];
    wrapper.vm.selectedPlayer2 = wrapper.vm.heroes[1];
    await wrapper.vm.$nextTick();

    // Cliquer sur le bouton de combat
    const fightButton = wrapper.find('.fight-btn');
    await fightButton.trigger('click');

    // Vérifier que la scène de combat est affichée
    expect(wrapper.vm.battleStarted).toBe(true);
    expect(wrapper.findComponent(FightScene).exists()).toBe(true);
  });

  it('filters heroes based on search query for player 1', async () => {
    // Simuler une recherche pour le joueur 1
    wrapper.vm.searchQueryPlayer1 = 'Hero 1';
    await wrapper.vm.$nextTick();

    // Vérifier que le héros filtré est correct
    const filteredHeroes = wrapper.vm.filteredHeroesPlayer1;
    expect(filteredHeroes.length).toBe(1);
    expect(filteredHeroes[0].name).toBe('Hero 1');
  });

  it('sorts heroes by name (A-Z) for player 2', async () => {
    // Simuler un tri par nom (A-Z) pour le joueur 2
    wrapper.vm.sortHeroes('name', 'asc', 'player2');
    await wrapper.vm.$nextTick();

    // Vérifier que les héros sont triés
    const sortedHeroes = wrapper.vm.filteredHeroesPlayer2;
    expect(sortedHeroes[0].name).toBe('Hero 1');
    expect(sortedHeroes[1].name).toBe('Hero 2');
  });

  it('toggles the filter menu for player 1', async () => {
    // Simuler l'ouverture du menu de filtres pour le joueur 1
    const filterButton = wrapper.find('.filter');
    await filterButton.trigger('click');

    // Vérifier que le menu de filtres est affiché
    expect(wrapper.vm.showFilterMenuPlayer1).toBe(true);
    expect(wrapper.find('.filter-menu').exists()).toBe(true);
  });

  it('resets the battle when the restart event is emitted', async () => {
    // Simuler le démarrage du combat
    wrapper.vm.selectedPlayer1 = wrapper.vm.heroes[0];
    wrapper.vm.selectedPlayer2 = wrapper.vm.heroes[1];
    wrapper.vm.battleStarted = true;
    await wrapper.vm.$nextTick();

    // Simuler l'événement de redémarrage
    const fightScene = wrapper.findComponent(FightScene);
    fightScene.vm.$emit('restart');
    await wrapper.vm.$nextTick();

    // Vérifier que la scène de combat est réinitialisée
    expect(wrapper.vm.battleStarted).toBe(false);
    expect(wrapper.findComponent(FightScene).exists()).toBe(false);
  });
});