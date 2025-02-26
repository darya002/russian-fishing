<template>
  <div>
    <h2>{{ currentLocation.name }}</h2>
    <p>Выберите удочку и наживку.</p>

    <!-- Выбор удочки -->
    <h3>Удочки</h3>
    <select v-model="selectedRod">
      <option disabled value="">Выберите удочку</option>
      <option v-for="rod in rods" :key="rod.id" :value="rod">{{ rod.name }}</option>
    </select>

    <!-- Выбор наживки -->
    <h3>Наживки</h3>
    <select v-model="selectedBait">
      <option disabled value="">Выберите наживку</option>
      <option v-for="bait in baits" :key="bait.id" :value="bait">{{ bait.name }}</option>
    </select>

    <!-- Кнопка заброса удочки -->
    <button @click="startFishing" :disabled="!selectedRod || !selectedBait || isFishing">
      Забросить удочку
    </button>

    <!-- Визуализация процесса рыбалки -->
    <div v-if="isFishing" class="water" :style="waterStyle">
      <!-- Удочка с анимацией -->
      <div class="rod" :class="{ throwing: isThrowing, cast: isCasting, default: isRodDefault, returned: isRodReturned }"></div>
      <!-- Наживка с анимацией -->
      <div v-if="!isCaught" class="bait" :class="{ flying: isBaitFlying, biting: isBaitBiting }">💧</div>
    </div>

    <!-- Таймер и кнопка подсечки -->
    <div v-if="isFishing">
      <p v-if="isBaitBiting">Клюет рыба! Время: {{ biteTimer }} сек</p>
      <button @click="hookFish" :disabled="!isBaitBiting">Подсечь!</button>
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
      isThrowing: false,
      isCasting: false,
      isRodDefault: true,
      isRodReturned: false,
      isBaitFlying: false,
      isBaitBiting: false,
      biteTimer: 2,
      fishingTimer: null
    };
  },
  computed: {
    waterStyle() {
      return {
        backgroundImage: `url(${this.currentLocation ? this.currentLocation.image : ""})`
      };
    },
    totalCatchChance() {
      return (this.selectedRod ? this.selectedRod.catchChance : 0) + 
             (this.selectedBait ? this.selectedBait.catchBonus : 0);
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
      this.isRodDefault = false;
      this.isThrowing = true;

      // 1. Анимация заброса удочки
      setTimeout(() => {
        this.isThrowing = false;
        this.isCasting = true;

        // 2. Полет наживки
        this.isBaitFlying = true;
        setTimeout(() => {
          this.isBaitFlying = false;
          this.isCasting = false;

          // 3. Начало ожидания поклевки
          this.startBitePhase();
        }, 800);
      }, 500);
    },
    startBitePhase() {
      const biteDelay = Math.floor(Math.random() * (7000 - 3000) + 3000);

      setTimeout(() => {
        this.isBaitBiting = true;
        this.biteTimer = 2;

        // Таймер поклевки
        this.fishingTimer = setInterval(() => {
          if (this.biteTimer > 0) {
            this.biteTimer--;
          } else {
            this.isBaitBiting = false;
            clearInterval(this.fishingTimer);
            alert("Рыба сорвалась!");
            this.isFishing = false;
          }
        }, 1000);
      }, biteDelay);
    },
    hookFish() {
      if (!this.isBaitBiting) return;

      clearInterval(this.fishingTimer);
      this.isBaitBiting = false;

      const randomChance = Math.random();
      if (randomChance < this.totalCatchChance) {
        this.isCaught = true;
        alert("Вы поймали рыбу!");
      } else {
        alert("Рыба ускользнула!");
      }
      this.isFishing = false;
      this.isRodReturned = true;  // Удочка возвращается в вертикальное положение после подсекания
    }
  }
};
</script>

<style>
/* Удочка */
.rod {
  position: absolute;
  bottom: -50px;
  left: 50%;
  width: 5px;
  height: 100px;
  background-color: #6B4F47;
  border-radius: 5px;
  transform-origin: top;
  transition: transform 0.5s ease-in-out;
}

/* Анимация заброса */
.rod.throwing {
  transform: translateX(-50%) rotate(-30deg);
}

.rod.cast {
  transform: translateX(-50%) rotate(90deg);
}

.rod.default {
  transform: translateX(-50%) rotate(0deg);
}

/* Возврат удочки в вертикальное положение после подсекания */
.rod.returned {
  transform: translateX(-50%) rotate(0deg); /* Вернуть в вертикальное положение */
}
</style>
