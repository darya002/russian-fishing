export default class Inventory {
  constructor() {
    this.fishes = [];
  }

  getFishes() {
    return this.fishes;
  }

  addFish(fish) {
    // Проверяем, есть ли уже такая рыба в инвентаре
    const existingFish = this.fishes.find(f => f.name === fish.name);

    if (existingFish) {
      existingFish.count += 1; // Если есть, увеличиваем количество
    } else {
      this.fishes.push({ ...fish, count: 1 }); // Если нет, добавляем новую рыбу с количеством 1
    }
  }
}
