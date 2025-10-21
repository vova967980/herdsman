import * as PIXI from 'pixi.js';
import {
  ANIMAL_COUNT,
  GAME_BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH,
  PIXI_CONTAINER_ID
} from '../contstants';
import { Animal, Hero } from './entities';

export class Game {
  private app: PIXI.Application;
  private hero: Hero | null = null;
  private animals: Animal[] = [];

  constructor() {
    this.app = new PIXI.Application();
  }

  async init() {
    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: GAME_BACKGROUND_COLOR
    });

    document.getElementById(PIXI_CONTAINER_ID)?.appendChild(this.app.canvas);

    this.createHero();
    this.createAnimals();
    this.setupTicker();
    this.setupInput();
  }

  private createHero() {
    const x = this.app.screen.width / 2;
    const y = this.app.screen.height / 2;

    const hero = new Hero(x, y);
    hero.addToStage(this.app.stage);
    this.hero = hero;
  }

  private createAnimals() {
    for (let i = 0; i < ANIMAL_COUNT; i++) {
      const x = Math.random() * this.app.screen.width;
      const y = Math.random() * this.app.screen.height;

      const animal = new Animal(x, y);
      animal.addToStage(this.app.stage);
      this.animals.push(animal);
    }
  }

  private setupInput() {
    this.app.canvas.addEventListener('click', e => {
      if (!this.hero) return;

      const rect = this.app.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.hero.moveTo(x, y);
    });
  }

  private setupTicker() {
    this.app.ticker.add(this.update.bind(this));
  }

  private update(ticker: PIXI.Ticker) {
    const { deltaTime } = ticker;
    this.hero?.update(deltaTime);
  }
}
