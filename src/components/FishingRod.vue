<template>
    <div :class="['fishing-rod-container', positionClass]">
      <h3>{{ rod.name }}</h3>
  
      <div v-if="!isFishing">
        <h4>Наживки</h4>
        <select v-model="selectedBait">
          <option disabled value="">Выберите наживку</option>
          <option v-for="bait in availableBaits" :key="bait.id" :value="bait">
            {{ bait.name }} (осталось: {{ bait.count }})
          </option>
        </select>
        <button @click="startFishing" :disabled="!selectedBait">
          Забросить удочку
        </button>
      </div>
  
      <div v-if="isFishing" class="animation-container">
        <div
          class="rod"
          :class="{
            throwing: isThrowing,
            cast: isCasting,
            default: isRodDefault,
            returned: isRodReturned
          }"
        ></div>
        <div v-if="isBaitBiting" class="bite-indicator">💧</div>
      </div>
  
      <div v-if="isFishing" class="status">
        <button @click="hookFish" :disabled="!isBaitBiting">
          Подсечь!
        </button>
        <p v-if="isCaught">Поздравляем, рыба поймана!</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FishingRod",
    props: {
      rod: {
        type: Object,
        required: true
      },
      baits: {
        type: Array,
        required: true
      },
      currentLocation: {
        type: Object,
        required: true
      },
      position: {
        type: String,
        default: "left"
      }
    },
    data() {
      return {
        availableBaits: JSON.parse(JSON.stringify(this.baits)),
        selectedBait: null,
        isFishing: false,
        isCaught: false,
        isThrowing: false,
        isCasting: false,
        isRodDefault: true,
        isRodReturned: false,
        isBaitBiting: false,
        fishingTimer: null
      };
    },
    computed: {
      totalCatchChance() {
        return this.rod.catchChance + (this.selectedBait ? this.selectedBait.catchBonus : 0);
      },
      positionClass() {
        return this.position === "right" ? "rod-right" : "rod-left";
      }
    },
    methods: {
      consumeBait() {
        if (this.selectedBait) {
          this.selectedBait.count--;
          if (this.selectedBait.count <= 0) {
            const index = this.availableBaits.findIndex(b => b.id === this.selectedBait.id);
            if (index !== -1) {
              this.availableBaits.splice(index, 1);
            }
            this.selectedBait = null;
          }
        }
      },
      startFishing() {
        if (!this.selectedBait) {
          alert("Выберите наживку!");
          return;
        }
  
        this.isFishing = true;
        this.isCaught = false;
        this.isRodDefault = false;
        this.isRodReturned = false;
        this.isThrowing = true;
  
        setTimeout(() => {
          this.isThrowing = false;
          this.isCasting = true;
  
          setTimeout(() => {
            this.isCasting = false;
            this.startBitePhase();
          }, 800);
        }, 500);
      },
      startBitePhase() {
        const biteDelay = Math.floor(Math.random() * (7000 - 3000) + 3000);
        setTimeout(() => {
          this.isBaitBiting = true;
          this.fishingTimer = setTimeout(() => {
            this.isBaitBiting = false;
            this.consumeBait();
            alert("Рыба сорвалась!");
            this.isFishing = false;
          }, 2000);
        }, biteDelay);
      },
      hookFish() {
        if (!this.isBaitBiting) return;
  
        clearTimeout(this.fishingTimer);
        this.consumeBait();
        this.isBaitBiting = false;
        
        if (Math.random() < this.totalCatchChance) {
          this.isCaught = true;
          this.addFishToInventory();
        } else {
          alert("Рыба ускользнула!");
        }
  
        this.isFishing = false;
        this.isRodReturned = true;
        setTimeout(() => {
          this.isRodReturned = false;
          this.isRodDefault = true;
        }, 1000);
      },
      addFishToInventory() {
        const fishTypes = [
          { name: "Карп", image: "/assets/carp.jpg", price: 60 },
          { name: "Окунь", image: "/assets/perch.jpg", price: 70 },
          { name: "Щука", image: "/assets/pike.jpg", price: 90 }
        ];
        const caughtFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        caughtFish.count = 1;
        alert(`Поздравляем, вы поймали ${caughtFish.name}!`);
        this.$emit("update-inventory", caughtFish);
      }
    }
  };
  </script>
  
  <style scoped>
  .fishing-rod-container {
    position: absolute;
    bottom: 20px;
    width: 300px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 10px;
  }
  
  .rod-left {
    left: 10%;
  }
  
  .rod-right {
    right: 10%;
  }
  
  .animation-container {
    position: relative;
    height: 200px;
  }
  
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
  
  .rod.throwing {
    transform: translateX(-50%) rotate(-30deg);
  }
  
  .rod.cast {
    transform: translateX(-50%) rotate(90deg);
  }
  
  .rod.default {
    transform: translateX(-50%) rotate(0deg);
  }
  
  .rod.returned {
    transform: translateX(-50%) rotate(0deg);
  }
  
  .bite-indicator {
    position: absolute;
    left: 50%;
    bottom: 30px;
    font-size: 24px;
    animation: shake 0.5s infinite ease-in-out;
  }
  
  @keyframes shake {
    0% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    100% { transform: translateX(-5px); }
  }
  
  .status {
    margin-top: 10px;
  }
  </style>
  