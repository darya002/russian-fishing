 
class Inventory {
  constructor() {
    this.fishes = [];
  }

  addFish(fish) {
    const existingFish = this.fishes.find(f => f.name === fish.name);
    if (existingFish) {
      existingFish.count += fish.count;
    } else {
      this.fishes.push(fish);
    }
  }

  getFishes() {
    return this.fishes;
  }
}

export default Inventory;
