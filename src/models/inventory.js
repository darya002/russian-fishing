export default class Inventory {
  constructor() {
    this.fishes = [];
    this.rods = [];  
  }
 
  getFishes() {
    return this.fishes;
  }

  addFish(fish) {
    const existingFish = this.fishes.find(f => f.name === fish.name);

    if (existingFish) {
      existingFish.count = (existingFish.count || 1) + 1;  
    } else {
      this.fishes.push({ ...fish, count: 1 }); 
    }
  }
 
  removeFish(fishName) {
    this.fishes = this.fishes
      .map(fish => fish.name === fishName ? { ...fish, count: fish.count - 1 } : fish)
      .filter(fish => fish.count > 0);
  }

  clearFishes() {
    this.fishes = [];
  }

  getRods() {
    return this.rods;
  }

  addRod(rod) {
    if (!this.rods.some(r => r.id === rod.id)) {
      this.rods.push(rod);  
    }
  }
}
