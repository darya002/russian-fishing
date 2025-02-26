<template>
  <div id="app">
    <MainMenu v-if="screen === 'menu'" @change-screen="changeScreen" />
    <FishingLocations
      v-if="screen === 'locations'"
      :locations="locations"
      @change-screen="changeScreen"
      @select-location="selectLocation"
    />
    <FishingScreen
      v-if="screen === 'fishing'"
      :currentLocation="currentLocation"
      :rods="rods"
      :baits="baits"
      @change-screen="changeScreen"
    />
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FishingLocations from "./components/FishingLocations.vue";
import FishingScreen from "./components/FishingScreen.vue";

export default {
  name: "App",
  components: {
    MainMenu,
    FishingLocations,
    FishingScreen
  },
  data() {
    return {
      screen: "menu",
      locations: [
        { id: 1, name: "Озеро", image: "/assets/lake.jpg" },
        { id: 2, name: "Река", image: "/assets/river.jpg" },
        { id: 3, name: "Пруд", image: "/assets/pond.jpg" }
      ],
      rods: [
        { id: 1, name: "Обычная удочка", castTime: 2, catchChance: 0.3 },
        { id: 2, name: "Профессиональная удочка", castTime: 1, catchChance: 0.6 }
      ],
      baits: [
        { id: 1, name: "Червь", catchBonus: 0.2 },
        { id: 2, name: "Кукуруза", catchBonus: 0.1 }
      ],
      currentLocation: null
    };
  },
  methods: {
    changeScreen(screen) {
      this.screen = screen;
    },
    selectLocation(location) {
      this.currentLocation = location;
      this.changeScreen("fishing");
    }
  }
};
</script>