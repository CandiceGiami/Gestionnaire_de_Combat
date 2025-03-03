<template>
  <div v-if="heroStore.selectedHero" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <button @click="closePopup" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">&times;</button>
      <img :src="heroStore.selectedHero.image" alt="Hero Image" class="w-full h-64 object-cover rounded-md mb-4" />
      <h2 class="text-xl font-bold">{{ heroStore.selectedHero.name }}</h2>
      <p class="text-gray-700 mt-2">{{ heroStore.selectedHero.description || 'Aucune description disponible.' }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useHeroStore } from '@/stores/HeroStore';

export default defineComponent({
  setup() {
    const heroStore = useHeroStore();
    
    const closePopup = () => {
      heroStore.selectedHero = null;
    };
    
    return { heroStore, closePopup };
  }
});
</script>

<style scoped>
</style>
