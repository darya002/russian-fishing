<template>
  <div>
    <h2>{{ currentLocation.name }}</h2>
    <p>Выберите удочку и наживку.</p>

    <h3>Удочки</h3>
    <select v-model="selectedRod">
      <option disabled value="">Выберите удочку</option>
      <option v-for="rod in rods" :key="rod.id" :value="rod">{{ rod.name }}</option>
    </select>

    <h3>Наживки</h3>
    <select v-model="selectedBait">
      <option disabled value="">Выберите наживку</option>
      <option v-for="bait in baits" :key="bait.id" :value="bait">{{ bait.name }}</option>
    </select>

    <button @click="startFishing" :disabled="!selectedRod || !selectedBait">
      Забросить удочку
    </button>

    <div v-if="isFishing" class="water" :style="waterStyle">
      <div class="rod" :style="rodStyle"></div>
      <div v-if="!isCaught" class="bait">💧</div>
    </div>

    <!-- Таймер и кнопка подсечки -->
    <div v-if="isFishing">
      <p>Клюет рыба! Время: {{ timer }} сек</p>
      <button 
        @click="hookFish" 
        :disabled="!canHookFish">
        Подсечь!
      </button>
      <p v-if="isCaught">Поздравляем, рыба поймана!</p>
    </div>

    <button @click="$emit('change-screen', 'locations')">Назад</button>
  </div>
</template>

<script>
export default {
  name: "FishingScreen",
  props: ["currentLocation", "rods", "baits"],
  data() {
    return {
      selectedRod: null,
      selectedBait: null,
      isFishing: false,
      isCaught: false,
      timer: 5,
      fishingInterval: null,
      isFishCaught: false
    };
  },
  computed: {
    waterStyle() {
      return {
        backgroundImage: `url(${this.currentLocation ? this.currentLocation.image : ""})`
      };
    },
    totalCatchChance() {
      return (this.selectedRod ? this.selectedRod.catchChance : 0) + (this.selectedBait ? this.selectedBait.catchBonus : 0);
    },
    canHookFish() {
      return this.timer === 0 && this.isFishing && !this.isFishCaught;
    }
  },
  methods: {
    startFishing() {
      if (!this.selectedRod || !this.selectedBait) {
        alert("Выберите снасти!");
        return;
      }

      this.isFishing = true;
      this.isCaught = false;
      this.isFishCaught = false;
      this.timer = 5;
      this.startFishingProcess();
    },
    startFishingProcess() {
      this.fishingInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.fishingInterval);
          this.timer = 0; // Ставим 0, чтобы canHookFish разрешал кнопку
        }
      }, 1000);
    },
    hookFish() {
      if (!this.canHookFish) return;

      // Проверяем шанс поймать рыбу
      const randomChance = Math.random();
      console.log(`Шанс поимки: ${this.totalCatchChance}, Выпало: ${randomChance}`);

      if (randomChance < this.totalCatchChance) {
        this.isFishCaught = true;
        this.isCaught = true;
        clearInterval(this.fishingInterval);
        alert("Вы поймали рыбу!");
      } else {
        alert("Рыба ускользнула!");
      }
      this.isFishing = false;
    }
  }
};
</script>
