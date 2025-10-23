import * as PIXI from 'pixi.js';
import {
  ANIMAL_COUNT, ANIMAL_FOLLOW_DISTANCE, ANIMAL_RADIUS,
  GAME_BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH, HERO_RADIUS, HERO_SPEED, MAX_ANIMALS_ON_FIELD, MAX_GROUP_SIZE,
  PIXI_CONTAINER_ID, YARD_MARGIN
} from '../contstants';
import { Animal, Hero, Yard } from './entities';
import { Score } from './ui';
import { SpawnGenerator } from './core/SpawnGenerator.ts';

export class Game {
  private readonly app: PIXI.Application;
  private hero: Hero | null = null;
  private animals: Animal[] = [];
  private yard: Yard | null = null;
  private score: Score | null = null;
  private group: Animal[] = [];
  private spawner: SpawnGenerator<Animal> | null = null;

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

    this.createYard();
    this.createHero();
    this.createScore();
    this.setupSpawner();
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
    if (!this.spawner || !this.yard) return;

    for (let i = 0; i < ANIMAL_COUNT; i++) {
      const animal = this.spawner.spawnEntity();
      this.animals.push(animal);
    }
  }

  private createYard() {
    const yard = new Yard();
    yard.addToStage(this.app.stage);
    this.yard = yard;
  }

  private createScore() {
    const score = new Score();
    score.addToStage(this.app.stage);
    this.score = score;
  }

  private setupSpawner() {
    if (!this.yard) return;

    const yardRect = {
      x: this.yard.sprite.x,
      y: this.yard.sprite.y,
      width: this.yard.sprite.width,
      height: this.yard.sprite.height
    };

    this.spawner = new SpawnGenerator<Animal>({
      app: this.app,
      restrictedRect: yardRect,
      restrictedRectBuffer: YARD_MARGIN,
      maxEntities: MAX_ANIMALS_ON_FIELD,
      getActiveCount: () => this.animals.length,
      createEntity: (x, y) => new Animal(x, y, yardRect, YARD_MARGIN),
      onSpawn: (animal) => {
        this.animals.push(animal);
      }
    });
    this.spawner.start();
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
    if (!this.hero || !this.yard) return;

    this.hero.update(deltaTime);

    const yardRect = {
      x: this.yard.sprite.x,
      y: this.yard.sprite.y,
      width: this.yard.sprite.width,
      height: this.yard.sprite.height
    };

    for (const animal of this.animals) {
      animal.update(deltaTime, HERO_SPEED);

      if (this.group.includes(animal)) {

        const { x, y } = animal.position;
        const inYard =
          x >= yardRect.x &&
          x <= yardRect.x + yardRect.width &&
          y >= yardRect.y &&
          y <= yardRect.y + yardRect.height;

        if (inYard) {
          animal.stopFollow();
          this.score?.increase();
          this.app.stage.removeChild(animal.sprite);

          this.group = this.group.filter(a => a !== animal);
          this.animals = this.animals.filter(a => a !== animal);
        }
        continue;
      }

      const dx = this.hero.sprite.x - animal.sprite.x;
      const dy = this.hero.sprite.y - animal.sprite.y;
      const dist = Math.hypot(dx, dy);

      if (dist < ANIMAL_FOLLOW_DISTANCE && this.group.length < MAX_GROUP_SIZE) {
        const followRadius = HERO_RADIUS + ANIMAL_RADIUS + 3
        animal.follow(this.hero.sprite, this.group.length, followRadius, MAX_GROUP_SIZE);
        this.group.push(animal);
      }
    }
  }
}
