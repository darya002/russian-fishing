<template>
  <div>
    <h2>{{ currentLocation.name }}</h2>
    <p>Выберите снасти для каждой удочки.</p>
    
     <div class="rod-selection">
      <div>
        <label>Левая удочка:</label>
        <select v-model="selectedLeftRod">
          <option disabled value="">Выберите удочку</option>
          <option v-for="rod in allRods" :key="rod.id" :value="rod">
            {{ rod.name }}
          </option>
        </select>
      </div>
      <div>
        <label>Правая удочка:</label>
        <select v-model="selectedRightRod">
          <option disabled value="">Выберите удочку</option>
          <option v-for="rod in allRods" :key="rod.id" :value="rod">
            {{ rod.name }}
          </option>
        </select>
      </div>
    </div>

     <div class="fishing-area" :style="waterStyle">
      <FishingRod
        :rod="selectedLeftRod"
        :baits="baits"
        :currentLocation="currentLocation"
        position="left"
        @update-inventory="updateInventory"
      />
      <FishingRod
        :rod="selectedRightRod"
        :baits="baits"
        :currentLocation="currentLocation"
        position="right"
        @update-inventory="updateInventory"
      />
    </div>
    
    <button @click="$emit('change-screen', 'locations')">Назад</button>
  </div>
</template>

<script>
import FishingRod from "./FishingRod.vue";

export default {
  name: "FishingScreen",
  props: ["currentLocation", "baits", "inventory"],
  components: {
    FishingRod
  },
  data() {
    return {
       allRods: [
        { id: 1, name: "Палка и леска", castTime: 3, catchChance: 0.3 },
        { id: 2, name: "Профессиональная удочка", castTime: 1, catchChance: 0.7 },
        { id: 3, name: "Обычная удочка", castTime: 2, catchChance: 0.5 }
      ],
      selectedLeftRod: null,
      selectedRightRod: null
    };
  },
  computed: {
    waterStyle() {
      return {
        backgroundImage: `url(${this.currentLocation ? this.currentLocation.image : ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        width: "100%",
        height: "400px"
      };
    }
  },
  methods: {
    updateInventory(fish) {
      this.$emit("update-inventory", fish);
    }
  }
};
</script>

<style>
.fishing-area {
  position: relative;
  margin: 20px 0;
}
.rod-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
</style>
