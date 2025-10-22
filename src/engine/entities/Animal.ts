import * as PIXI from 'pixi.js';
import { ANIMAL_FOLLOW_SPEED } from '../../contstants';

export class Animal {
  public sprite: PIXI.Graphics;
  private isFollowing = false;
  private target: { x: number; y: number } | null = null;

  constructor(x: number, y: number) {
    this.sprite = new PIXI.Graphics()
      .circle(0, 0, 10)
      .fill(0xffffff);

    this.sprite.x = x;
    this.sprite.y = y;
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this.sprite);
  }

  follow(target: { x: number; y: number }) {
    this.isFollowing = true;
    this.target = target;
  }

  stopFollow() {
    this.isFollowing = false;
    this.target = null;
  }

  update(deltaTime: number) {
    if (!this.isFollowing || !this.target) return;

    const dx = this.target.x - this.sprite.x;
    const dy = this.target.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);
    const step = ANIMAL_FOLLOW_SPEED * (deltaTime / 60);

    if (dist > 1) {
      this.sprite.x += (dx / dist) * step;
      this.sprite.y += (dy / dist) * step;
    }
  }

  get position() {
    return this.sprite;
  }

  get isInGroup() {
    return this.isFollowing;
  }
}
