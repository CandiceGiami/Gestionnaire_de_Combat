import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HeroLibrary from '../../src/views/HeroLibrary.vue';
import { useHeroStore } from "../../src/stores/HeroStore";
import HeroCard from '../../src/components/HeroCard.vue';
import HeroDetails from '../../src/components/HeroDetails.vue';

// Mock du store HeroStore
vi.mock('@/stores/HeroStore');

describe('HeroLibrary.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Mock du HeroStore pour tester
    useHeroStore.mockReturnValue({
      heroes: [
        {
          id: 1,
          name: 'Hero 1',
          biography: { publisher: 'Marvel' },
          images: { md: 'path/to/hero1-image.jpg' },
          powerstats: {
            intelligence: '80',
            strength: '90',
            speed: '85',
            durability: '80',
            power: '75',
            combat: '70',
          },
          appearance: {
            height: ["6'2", "188 cm"],
            weight: ["210 lbs", "95 kg"],
            hairColor: "Black",
          },
          connections: {
            groupAffiliation: 'Avengers',
            relatives: 'None',
          },
        },
        {
          id: 2,
          name: 'Hero 2',
          biography: { publisher: 'DC' },
          images: { md: 'path/to/hero2-image.jpg' },
          powerstats: {
            intelligence: '60',
            strength: '75',
            speed: '80',
            durability: '70',
            power: '65',
            combat: '60',
          },
          appearance: {
            height: ["5'10", "178 cm"],
            weight: ["190 lbs", "86 kg"],
            hairColor: "Brown",
          },
          connections: {
            groupAffiliation: 'Justice League',
            relatives: 'Unknown',
          },
        },
      ],
      fetchHeroes: vi.fn(),
    });

    wrapper = mount(HeroLibrary);
  });

  it('should render the component correctly', () => {
    expect(wrapper.find('.hero-library').exists()).toBe(true);
    expect(wrapper.find('.title').text()).toBe('Bibliothèque des Héros');
  });

  it('should filter heroes by search query', async () => {
    const searchInput = wrapper.find('.search-input');
    await searchInput.setValue('Hero 1');
    await wrapper.vm.$nextTick();

    const displayedHeroes = wrapper.findAllComponents(HeroCard);
    expect(displayedHeroes.length).toBe(1);
    expect(displayedHeroes[0].props().hero.name).toBe('Hero 1');
  });

  it('should filter heroes by publisher', async () => {
    const publisherDropdown = wrapper.find('.filter-dropdown');
    await publisherDropdown.setValue('Marvel');
    await wrapper.vm.$nextTick();

    const displayedHeroes = wrapper.findAllComponents(HeroCard);
    expect(displayedHeroes.length).toBe(1);
    expect(displayedHeroes[0].props().hero.biography.publisher).toBe('Marvel');
  });

  it('should sort heroes by name (A-Z)', async () => {
    const sortDropdown = wrapper.findAll('.filter-dropdown').at(1);
    await sortDropdown.setValue('name-asc');
    await wrapper.vm.$nextTick();

    const displayedHeroes = wrapper.findAllComponents(HeroCard);
    expect(displayedHeroes[0].props().hero.name).toBe('Hero 1');
    expect(displayedHeroes[1].props().hero.name).toBe('Hero 2');
  });

  it('should sort heroes by score (high-low)', async () => {
    const sortDropdown = wrapper.findAll('.filter-dropdown').at(1);
    await sortDropdown.setValue('score-desc');
    await wrapper.vm.$nextTick();

    const displayedHeroes = wrapper.findAllComponents(HeroCard);
    expect(displayedHeroes[0].props().hero.name).toBe('Hero 1');
    expect(displayedHeroes[1].props().hero.name).toBe('Hero 2');
  });

  it('should show hero details when clicking on a hero card', async () => {
    const heroCard = wrapper.findAllComponents(HeroCard).at(0);
    await heroCard.trigger('click');

    expect(wrapper.vm.selectedHero).toEqual(wrapper.vm.filteredHeroes[0]);
    expect(wrapper.findComponent(HeroDetails).exists()).toBe(true);
  });

  it('should close hero details when the close event is emitted', async () => {
    // Set selected hero using the mock data
    wrapper.vm.selectedHero = wrapper.vm.filteredHeroes[0];
    await wrapper.vm.$nextTick();

    // Ensure HeroDetails is rendered
    expect(wrapper.findComponent(HeroDetails).exists()).toBe(true);

    // Emit the close event from HeroDetails
    const heroDetails = wrapper.findComponent(HeroDetails);
    await heroDetails.vm.$emit('close');

    // Ensure selectedHero is null after closing
    expect(wrapper.vm.selectedHero).toBeNull();
  });
});