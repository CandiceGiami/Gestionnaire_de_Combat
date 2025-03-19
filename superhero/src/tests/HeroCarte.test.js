import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import HeroCard from '../../src/components/HeroCard.vue';

describe('HeroCard.vue', () => {
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

  it('affiche le nom du héros', () => {
    const wrapper = mount(HeroCard, {
      props: { hero, isHovered: false, isSelected: false },
    });
    expect(wrapper.text()).toContain(hero.name);
  });

  it("émet l'événement 'select' lorsqu'on clique sur la carte", async () => {
    const wrapper = mount(HeroCard, { props: { hero, isHovered: false, isSelected: false } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0]).toEqual([hero]);
  });

  it("émet l'événement 'hover' et anime les statistiques au survol", async () => {
    vi.useFakeTimers();
    const wrapper = mount(HeroCard, { props: { hero, isHovered: false, isSelected: false } });

    await wrapper.trigger('mouseenter');
    expect(wrapper.emitted('hover')).toBeTruthy();
    expect(wrapper.emitted('hover')[0]).toEqual([hero.id]);

    vi.advanceTimersByTime(100);
    expect(wrapper.vm.animatedStats.intelligence).toBe(hero.powerstats.intelligence);
    expect(wrapper.vm.animatedStats.strength).toBe(hero.powerstats.strength);
    expect(wrapper.vm.animatedStats.speed).toBe(hero.powerstats.speed);
    expect(wrapper.vm.animatedStats.durability).toBe(hero.powerstats.durability);
    expect(wrapper.vm.animatedStats.power).toBe(hero.powerstats.power);

    vi.useRealTimers();
  });

  it("réinitialise l'animation après avoir quitté le survol", async () => {
    const wrapper = mount(HeroCard, { props: { hero, isHovered: false, isSelected: false } });

    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');

    expect(wrapper.emitted('hover')[1]).toEqual([null]);
    expect(wrapper.vm.animatedStats.intelligence).toBe(0);
    expect(wrapper.vm.animatedStats.strength).toBe(0);
    expect(wrapper.vm.animatedStats.speed).toBe(0);
    expect(wrapper.vm.animatedStats.durability).toBe(0);
    expect(wrapper.vm.animatedStats.power).toBe(0);
  });
});