import * as PIXI from 'pixi.js';
import { HERO_COLOR, HERO_RADIUS, HERO_SPEED } from '../../contstants';

export class Hero {
  public sprite: PIXI.Graphics;
  private target: { x: number; y: number } | null = null;

  constructor(x: number, y: number) {
    this.sprite = new PIXI.Graphics()
      .circle(0, 0, HERO_RADIUS)
      .fill(HERO_COLOR);

    this.sprite.x = x;
    this.sprite.y = y;
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this.sprite);
  }

  moveTo(x: number, y: number) {
    this.target = { x, y };
  }

  update(deltaTime: number) {
    if (!this.target) return;

    const dx = this.target.x - this.sprite.x;
    const dy = this.target.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);
    const step = HERO_SPEED * (deltaTime / 60);

    if (dist <= step) {
      this.sprite.x = this.target.x;
      this.sprite.y = this.target.y;
      this.target = null;
      return;
    }

    this.sprite.x += (dx / dist) * step;
    this.sprite.y += (dy / dist) * step;
  }
}
