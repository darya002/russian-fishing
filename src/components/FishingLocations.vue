<template>
    <div>
      <h2>Выбери локацию</h2>
      <div v-for="location in locations" :key="location.id" @click="selectLocation(location)">
        <img :src="location.image" :alt="location.name" class="location-image">
        <p>{{ location.name }}</p>
      </div>
      <button @click="$emit('change-screen', 'menu')">Назад</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "FishingLocations",
    props: ["locations"],
    methods: {
      selectLocation(location) {
        this.$emit("select-location", location);
      }
    }
  };
  </script>
  
  <style scoped>
  .location-image {
    width: 200px;
    cursor: pointer;
    display: block;
    margin: 10px auto;
    border-radius: 10px;
  }
  </style>