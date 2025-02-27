// /models/fish.js
export default class Fish {
    constructor(name) {
      this.name = name;
      this.count = 1; // Изначально рыба появляется в количестве 1
    }
  
    incrementCount() {
      this.count += 1; // Увеличиваем количество рыбы на 1
    }
  }
  