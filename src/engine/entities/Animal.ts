import * as PIXI from 'pixi.js';
import { ANIMAL_COLOR, ANIMAL_RADIUS } from '../../contstants';
import { receiveValidCoordinates } from '../../utils';
import { Rect } from '../../types';


export class Animal {
  public sprite: PIXI.Graphics;
  private isFollowing = false;
  private target: { x: number; y: number } | null = null;
  private angle = 0;
  private radius = 0;
  private speedFactor = 0.7 + Math.random() * 0.2;
  private patrolTarget: { x: number; y: number } | null = null;
  private readonly restrictedRect: Rect;
  private readonly restrictedRectBuffer: number;

  constructor(x: number, y: number, restrictedRect: Rect, restrictedRectBuffer: number) {
    this.sprite = new PIXI.Graphics()
      .circle(0, 0, ANIMAL_RADIUS)
      .fill(ANIMAL_COLOR);

    this.sprite.x = x;
    this.sprite.y = y;

    this.restrictedRect = restrictedRect;
    this.restrictedRectBuffer = restrictedRectBuffer;
    this.chooseNewPatrolTarget();
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this.sprite);
  }

  follow(target: { x: number; y: number }, index: number, radius: number, slotsCount: number) {
    this.isFollowing = true;
    this.target = target;
    this.patrolTarget = null;

    const spacing = (Math.PI * 2) / slotsCount;
    this.angle = index * spacing;
    this.radius = radius;
  }

  stopFollow() {
    this.isFollowing = false;
    this.target = null;
  }

  private chooseNewPatrolTarget() {
    const { x, y } = receiveValidCoordinates(this.restrictedRect, this.restrictedRectBuffer);
    this.patrolTarget = { x, y };
  }

  private reachedPatrolTarget() {
    if (!this.patrolTarget) return true;
    const dx = this.patrolTarget.x - this.sprite.x;
    const dy = this.patrolTarget.y - this.sprite.y;
    return Math.hypot(dx, dy) < 5;
  }

  update(deltaTime: number, maxSpeed: number) {
    const step = maxSpeed * this.speedFactor * (deltaTime / 60);

    if (this.isFollowing && this.target) {
      const targetX = this.target.x + Math.cos(this.angle) * this.radius;
      const targetY = this.target.y + Math.sin(this.angle) * this.radius;

      const dx = targetX - this.sprite.x;
      const dy = targetY - this.sprite.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 1) {
        this.sprite.x += (dx / dist) * step;
        this.sprite.y += (dy / dist) * step;
      }
      return;
    }

    if (!this.patrolTarget || this.reachedPatrolTarget()) {
      this.chooseNewPatrolTarget();
    }

    if (!this.patrolTarget) return;

    const dx = this.patrolTarget.x - this.sprite.x;
    const dy = this.patrolTarget.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 1) {
      this.sprite.x += (dx / dist) * step * 0.1;
      this.sprite.y += (dy / dist) * step * 0.1;
    }
  }

  get position() {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
