import * as PIXI from 'pixi.js';
import { ANIMAL_COLOR, ANIMAL_RADIUS } from '../../contstants';

export class Animal {
  public sprite: PIXI.Graphics;

  constructor(x: number, y: number) {
    this.sprite = new PIXI.Graphics()
      .circle(0, 0, ANIMAL_RADIUS)
      .fill(ANIMAL_COLOR);

    this.sprite.x = x;
    this.sprite.y = y;
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this.sprite);
  }

  get position() {
    return this.sprite;
  }
}
