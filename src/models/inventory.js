export default class Inventory {
  constructor() {
      this.fishes = [];
    }
  
    getFishes() {
      return this.fishes;
    }
  
    addFish(fish) { 
      const existingFish = this.fishes.find(f => f.name === fish.name);
      
      if (existingFish) {
        existingFish.incrementCount();  
      } else {
        this.fishes.push(fish); 
      }
    }
  } 