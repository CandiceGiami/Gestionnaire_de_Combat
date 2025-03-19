import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HeroDetails from '../../src/components/HeroDetails.vue';

// Définition d'un héros fictif pour les tests
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

// Définition de la suite de tests pour le composant HeroDetails
describe('HeroDetails.vue', () => {
  
  // Test : Vérifie si le composant affiche correctement les informations du héros
  it('affiche correctement les informations du héros', () => {
    // Monte le composant avec le héros fictif en prop
    const wrapper = mount(HeroDetails, {
      props: { hero: heroMock },
    });

    // Vérifie si le nom du héros est bien affiché
    expect(wrapper.find('.hero-name').text()).toBe(heroMock.name);

    // Vérifie si l'image du héros est bien affichée avec le bon lien
    expect(wrapper.find('.hero-image').attributes('src')).toBe(heroMock.images.md);

    // Vérifie si le publisher du héros est bien affiché
    expect(wrapper.find('.publisher').text()).toContain(heroMock.biography.publisher);
  });

  // Test : Vérifie si l'événement "close" est émis lorsqu'on clique sur le bouton de fermeture
  it('émet un événement "close" lors du clic sur le bouton de fermeture', async () => {
    // Monte le composant avec le héros fictif en prop
    const wrapper = mount(HeroDetails, {
      props: { hero: heroMock },
    });

    // Simule un clic sur le bouton de fermeture
    await wrapper.find('.close-btn').trigger('click');

    // Vérifie si l'événement "close" a bien été émis
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  // Test : Vérifie si l'événement "close" est émis lorsqu'on clique sur l'overlay
  it('émet un événement "close" lorsqu’on clique sur l’overlay', async () => {
    // Monte le composant avec le héros fictif en prop
    const wrapper = mount(HeroDetails, {
      props: { hero: heroMock },
    });

    // Simule un clic sur l'overlay du composant
    await wrapper.find('.hero-details-overlay').trigger('click');

    // Vérifie si l'événement "close" a bien été émis
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});