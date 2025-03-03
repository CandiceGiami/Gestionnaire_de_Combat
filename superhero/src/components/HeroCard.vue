<template>
  <div
    class="hero-card"
    :class="{ selected: isSelected }"
    @click="selectHero"
    @mouseenter="emitHover(hero.id)"
    @mouseleave="emitHover(null)"
  >
    <img :src="hero.image?.url" :alt="hero.name" />
    <HeroHover :hero="hero" :isHovered="isHovered" />
    <p>{{ hero.name }}</p>
  </div>
</template>

<script>
import HeroHover from "@/components/HeroHover.vue";

export default {
  components: { HeroHover },
  props: {
    hero: Object,
    isHovered: Boolean,
    isSelected: Boolean,
  },
  emits: ["hover", "select"],
  methods: {
    emitHover(id) {
      this.$emit("hover", id);
    },
    selectHero() {
      this.$emit("select", this.hero);
    },
  },
};
</script>
<style scoped>
.hero-card {
  text-align: center;
  padding: 15px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.hero-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
}

.hero-card img {
  width: 80%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

.hero-card p {
  font-size: 16px;
  text-transform: capitalize;
}
.hero-card.selected {
  border: 3px solid yellow;
}
</style>
