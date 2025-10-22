import * as PIXI from 'pixi.js';
import {
  ANIMAL_COUNT, ANIMAL_FOLLOW_DISTANCE,
  GAME_BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH, MAX_GROUP_SIZE,
  PIXI_CONTAINER_ID, YARD_HEIGHT, YARD_MARGIN, YARD_WIDTH
} from '../contstants';
import { Animal, Hero, Yard } from './entities';
import { Score } from './ui';
import { isInsideYard } from '../utils';

export class Game {
  private app: PIXI.Application;
  private hero: Hero | null = null;
  private animals: Animal[] = [];
  private yard: Yard | null = null;
  private score: Score | null = null;
  private group: Animal[] = [];

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
    this.createYard();
    this.createAnimals();
    this.createScore();
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
    const yardRect = {
      x: GAME_WIDTH - YARD_WIDTH - YARD_MARGIN,
      y: GAME_HEIGHT - YARD_HEIGHT - YARD_MARGIN,
      width: YARD_WIDTH,
      height: YARD_HEIGHT
    };

    for (let i = 0; i < ANIMAL_COUNT; i++) {
      let x, y;

      const buffer = YARD_MARGIN;

      do {
        x = Math.random() * this.app.screen.width;
        y = Math.random() * this.app.screen.height;
      } while (isInsideYard(x, y, {
        x: yardRect.x - buffer,
        y: yardRect.y - buffer,
        width: yardRect.width + buffer * 2,
        height: yardRect.height + buffer * 2
      }));

      const animal = new Animal(x, y);
      animal.addToStage(this.app.stage);
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

    if (!this.hero) return;

    this.hero.update(deltaTime);

    for (const animal of this.animals) {
      if (this.group.includes(animal)) {
        animal.update(deltaTime);
        continue;
      }

      const dx = this.hero.sprite.x - animal.sprite.x;
      const dy = this.hero.sprite.y - animal.sprite.y;
      const dist = Math.hypot(dx, dy);

      if (dist < ANIMAL_FOLLOW_DISTANCE && this.group.length < MAX_GROUP_SIZE) {
        const leader = this.group.length === 0
          ? this.hero.sprite
          : this.group[this.group.length - 1].sprite;

        animal.follow(leader);

        this.group.push(animal);
      }
    }
  }
}
