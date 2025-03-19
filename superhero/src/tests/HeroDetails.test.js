import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroDetails from '../../src/components/HeroDetails.vue';

describe('HeroDetails.vue', () => {
  const heroMock = {
    name: 'Spider-Man',
    images: { md: 'https://example.com/spiderman.jpg' },
    biography: {
      publisher: 'Marvel',
      alignment: 'Good',
      fullName: 'Peter Parker',
      aliases: ['Spidey', 'Web-Slinger'],
      placeOfBirth: 'New York, USA',
    },
    powerstats: {
      intelligence: 90,
      strength: 55,
      speed: 67,
      durability: 75,
      power: 85,
      combat: 95,
    },
    appearance: {
      height: ['5ft 10in', '178 cm'],
      weight: ['167 lb', '76 kg'],
      hairColor: 'Brown',
      eyeColor: 'Hazel',
    },
    connections: {
      groupAffiliation: 'Avengers',
      relatives: 'May Parker (aunt), Ben Parker (uncle, deceased)',
    },
  };

  it('affiche correctement les informations du héros', () => {
    const wrapper = mount(HeroDetails, {
      props: { hero: heroMock },
    });

    // Vérifier le nom du héros
    expect(wrapper.find('.hero-name').text()).toBe(heroMock.name);

    // Vérifier l'image
    expect(wrapper.find('.hero-image').attributes('src')).toBe(heroMock.images.md);

    // Vérifier le publisher
    expect(wrapper.find('.publisher').text()).toContain(heroMock.biography.publisher);
  });

  it('émet un événement "close" lors du clic sur le bouton de fermeture', async () => {
    const wrapper = mount(HeroDetails, {
      props: { hero: heroMock },
    });

    await wrapper.find('.close-btn').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('émet un événement "close" lorsqu’on clique sur l’overlay', async () => {
    const wrapper = mount(HeroDetails, {
      props: { hero: heroMock },
    });

    await wrapper.find('.hero-details-overlay').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});