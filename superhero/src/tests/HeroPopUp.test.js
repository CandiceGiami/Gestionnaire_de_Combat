import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import SelectedHeroPopup from "../../src/components/HeroPopUp.vue";
import { useHeroStore } from "../../src/stores/HeroStore";

describe("SelectedHeroPopup.vue", () => {
  let wrapper;
  let heroStore;

  const heroMock = {
    images: { md: "https://via.placeholder.com/150" },
    name: "Superman",
    biography: { publisher: "DC Comics" },
  };

  beforeEach(() => {
    // Create a Pinia instance and set it as active
    const pinia = createPinia();
    setActivePinia(pinia);

    // Initialize the HeroStore
    heroStore = useHeroStore();

    // Simulate selecting a hero BEFORE mounting the component
    heroStore.selectedHero = heroMock;

    // Mount the component with the Pinia store
    wrapper = mount(SelectedHeroPopup, {
      global: {
        plugins: [pinia], // Pass the Pinia instance as a plugin
      },
    });
  });

  it("affiche les informations du héros sélectionné", async () => {
    // Ensure the popup is visible
    expect(wrapper.find("div.fixed").exists()).toBe(true);

    // Check the hero image
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe(heroMock.images.md);

    // Check the hero name
    const heroName = wrapper.find("h2");
    expect(heroName.exists()).toBe(true);
    expect(heroName.text()).toBe(heroMock.name);

    // Check the publisher
    const publisher = wrapper.find("p");
    expect(publisher.exists()).toBe(true);
    expect(publisher.text()).toContain(heroMock.biography.publisher);
  });

  it('affiche "Éditeur inconnu" si l\'éditeur est absent', async () => {
    // Update the hero to have no publisher
    heroStore.selectedHero = { ...heroMock, biography: { publisher: "" } };
    await wrapper.vm.$nextTick(); // Wait for the DOM to update

    // Check the publisher text
    const publisher = wrapper.find("p");
    expect(publisher.exists()).toBe(true);
    expect(publisher.text()).toContain("Éditeur inconnu");
  });

  it("ferme le popup lorsque le bouton de fermeture est cliqué", async () => {
    // Ensure the popup is visible initially
    expect(wrapper.find("div.fixed").exists()).toBe(true);

    // Click the close button
    await wrapper.find("button").trigger("click");

    // Ensure the popup is no longer visible
    expect(wrapper.find("div.fixed").exists()).toBe(false);
  });

  it("n'affiche pas le popup si aucun héros n'est sélectionné", async () => {
    // Set selectedHero to null to simulate no hero selected
    heroStore.selectedHero = null;
    await wrapper.vm.$nextTick(); // Wait for the DOM to update

    // Ensure the popup is not visible
    expect(wrapper.find("div.fixed").exists()).toBe(false);
  });
});