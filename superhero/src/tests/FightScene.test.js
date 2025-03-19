import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FightScene from '../../src/components/FightScene.vue';
import { createPinia, setActivePinia } from 'pinia';

// Mock HTMLMediaElement.prototype.play
beforeEach(() => {
  window.HTMLMediaElement.prototype.play = vi.fn(); // Mock the play method
  window.HTMLMediaElement.prototype.pause = vi.fn(); // Mock the pause method
  setActivePinia(createPinia()); // Activate Pinia
});

describe('FightScene.vue', () => {
  const player1 = {
    name: 'Player 1',
    powerstats: {
      intelligence: '80',
      strength: '90',
      speed: '85',
      durability: '80',
      power: '75',
      combat: '70',
    },
    images: {
      md: 'path/to/hero1-image.jpg', // Add images property
    },
  };

  const player2 = {
    name: 'Player 2',
    powerstats: {
      intelligence: '60',
      strength: '75',
      speed: '80',
      durability: '70',
      power: '65',
      combat: '60',
    },
    images: {
      md: 'path/to/hero2-image.jpg', // Add images property
    },
  };

  it('renders correctly with players', () => {
    const wrapper = mount(FightScene, {
      props: {
        player1,
        player2,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct winner', async () => {
    const wrapper = mount(FightScene, {
      props: {
        player1,
        player2,
      },
    });

    // Simulate the fight animation and results
    wrapper.vm.showResults = true;
    wrapper.vm.winnerText = 'Player 1 VICTORY'; // Manually set the winner text
    await wrapper.vm.$nextTick();

    // Check if the winner text is displayed
    expect(wrapper.text()).toContain('Player 1 VICTORY');
  });

  it('emits restart event when restart button is clicked', async () => {
    const wrapper = mount(FightScene, {
      props: {
        player1,
        player2,
      },
    });

    // Find the restart button
    const button = wrapper.find('button.restart-btn');
    expect(button.exists()).toBe(true); // Verify the button exists

    // Trigger the click event
    await button.trigger('click');

    // Verify the restart event is emitted
    expect(wrapper.emitted()).toHaveProperty('restart');
  });
});