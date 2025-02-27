// models/inventory.js 

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
          existingFish.incrementCount(); // Если есть, увеличиваем количество
        } else {
          this.fishes.push(fish); // Если нет, добавляем новую рыбу
        }
      }
    } 