import { mount } from '@vue/test-utils'; 
import { describe, it, expect, vi } from 'vitest'; 
import HeroCard from '../../src/components/HeroCard.vue';

// Définition d'une suite de tests pour le composant HeroCard
describe('HeroCard.vue', () => {
  // Définition d'un objet représentant un héros de test
  const hero = {
    id: 1,
    name: 'Superman',
    images: { md: 'superman.jpg' },
    powerstats: {
      intelligence: 85,
      strength: 100,
      speed: 90,
      durability: 95,
      power: 100,
    },
  };

  // Test : Vérifie si le nom du héros s'affiche correctement
  it('affiche le nom du héros', () => {
    // Monte le composant avec les props du héros
    const wrapper = mount(HeroCard, {
      props: { hero, isHovered: false, isSelected: false },
    });
    // Vérifie si le texte du wrapper contient le nom du héros
    expect(wrapper.text()).toContain(hero.name);
  });

  // Test : Vérifie si l'événement "select" est émis lors d'un clic sur la carte
  it("émet l'événement 'select' lorsqu'on clique sur la carte", async () => {
    // Monte le composant avec les props du héros
    const wrapper = mount(HeroCard, { props: { hero, isHovered: false, isSelected: false } });

    // Simule un clic sur le composant
    await wrapper.trigger('click');

    // Vérifie si l'événement 'select' a bien été émis
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0]).toEqual([hero]);
  });

  // Test : Vérifie si l'événement "hover" est émis et si les statistiques s'animent au survol
  it("émet l'événement 'hover' et anime les statistiques au survol", async () => {
    // Utilisation de faux timers pour contrôler l'animation
    vi.useFakeTimers();

    // Monte le composant avec les props du héros
    const wrapper = mount(HeroCard, { props: { hero, isHovered: false, isSelected: false } });

    // Simule l'événement `mouseenter` (survol de la carte)
    await wrapper.trigger('mouseenter');

    // Vérifie si l'événement "hover" a bien été émis avec l'ID du héros
    expect(wrapper.emitted('hover')).toBeTruthy();
    expect(wrapper.emitted('hover')[0]).toEqual([hero.id]);

    // Avance le timer de 100ms pour simuler l'animation des statistiques
    vi.advanceTimersByTime(100);

    // Vérifie si les statistiques animées correspondent aux valeurs du héros
    expect(wrapper.vm.animatedStats.intelligence).toBe(hero.powerstats.intelligence);
    expect(wrapper.vm.animatedStats.strength).toBe(hero.powerstats.strength);
    expect(wrapper.vm.animatedStats.speed).toBe(hero.powerstats.speed);
    expect(wrapper.vm.animatedStats.durability).toBe(hero.powerstats.durability);
    expect(wrapper.vm.animatedStats.power).toBe(hero.powerstats.power);

    // Réinitialise les timers pour éviter d'affecter d'autres tests
    vi.useRealTimers();
  });

  // Test : Vérifie si l'animation est réinitialisée après avoir quitté le survol
  it("réinitialise l'animation après avoir quitté le survol", async () => {
    // Monte le composant avec les props du héros
    const wrapper = mount(HeroCard, { props: { hero, isHovered: false, isSelected: false } });

    // Simule un survol de la carte
    await wrapper.trigger('mouseenter');
    // Simule la sortie du survol de la carte
    await wrapper.trigger('mouseleave');

    // Vérifie si l'événement "hover" est émis avec une valeur `null` pour indiquer que le survol est terminé
    expect(wrapper.emitted('hover')[1]).toEqual([null]);

    // Vérifie si les statistiques sont bien réinitialisées à 0
    expect(wrapper.vm.animatedStats.intelligence).toBe(0);
    expect(wrapper.vm.animatedStats.strength).toBe(0);
    expect(wrapper.vm.animatedStats.speed).toBe(0);
    expect(wrapper.vm.animatedStats.durability).toBe(0);
    expect(wrapper.vm.animatedStats.power).toBe(0);
  });
});
