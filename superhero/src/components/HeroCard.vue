<script>
export default {
  props: {
    hero: Object,
    isHovered: Boolean,
    isSelected: Boolean,
  },
  data() {
    return {
      animatedStats: {
        intelligence: 0,
        strength: 0,
        speed: 0,
        durability: 0,
        power: 0,
      },
    };
  },
  methods: {
    startAnimation() {
      this.$emit("hover", this.hero.id);
      setTimeout(() => {
        this.animatedStats.intelligence = this.hero.powerstats.intelligence;
        this.animatedStats.strength = this.hero.powerstats.strength;
        this.animatedStats.speed = this.hero.powerstats.speed;
        this.animatedStats.durability = this.hero.powerstats.durability;
        this.animatedStats.power = this.hero.powerstats.power;
      }, 100);
    },
    resetAnimation() {
      this.$emit("hover", null);
      this.animatedStats.intelligence = 0;
      this.animatedStats.strength = 0;
      this.animatedStats.speed = 0;
      this.animatedStats.durability = 0;
      this.animatedStats.power = 0;
    },
    selectHero() {
      this.$emit("select", this.hero);
    },
  },
};
</script>

<template>
  <div
    class="hero-card"
    :class="{ selected: isSelected }"
    @click="selectHero"
    @mouseenter="startAnimation"
    @mouseleave="resetAnimation"
  >
    <div class="hero-image-container">
      <img :src="hero.images.md" :alt="hero.name" />
      <div v-if="isHovered" class="hero-stats">
        <p><strong>Intelligence:</strong></p>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: animatedStats.intelligence + '%' }"></div>
        </div>

        <p><strong>Strength:</strong></p>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: animatedStats.strength + '%' }"></div>
        </div>

        <p><strong>Speed:</strong></p>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: animatedStats.speed + '%' }"></div>
        </div>

        <p><strong>Durability:</strong></p>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: animatedStats.durability + '%' }"></div>
        </div>

        <p><strong>Power:</strong></p>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: animatedStats.power + '%' }"></div>
        </div>
      </div>
    </div>
    <p>{{ hero.name }}</p>
  </div>
</template>

<style scoped>
.hero-card {
  position: relative;
  text-align: center;
  padding: 15px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  z-index: 1;
}

.hero-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
}

.hero-image-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.hero-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
}

/* Pop-up des stats SUR la carte */
.hero-stats {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 95%;
  background: rgba(0, 0, 0, 0.8); /* Fond sombre semi-transparent */
  color: white;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-card:hover .hero-stats {
  opacity: 1;
}

/* Barre de progression */
.stat-bar {
  width: 80%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 3px;
}

/* Animation fluide */
.stat-fill {
  height: 100%;
  background: yellow;
  width: 0%;
  transition: width 0.8s ease-out;
}

.hero-card.selected {
  border: 3px solid yellow;
}
</style>
