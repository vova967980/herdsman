import * as PIXI from 'pixi.js';
import { YARD_COLOR, YARD_WIDTH, YARD_HEIGHT, YARD_MARGIN, GAME_WIDTH, GAME_HEIGHT } from '../../contstants';

export class Yard {
  public sprite: PIXI.Graphics;

  constructor() {
    this.sprite = new PIXI.Graphics()
      .rect(0, 0, YARD_WIDTH, YARD_HEIGHT)
      .fill(YARD_COLOR);

    this.sprite.x = GAME_WIDTH - YARD_WIDTH - YARD_MARGIN;
    this.sprite.y = GAME_HEIGHT - YARD_HEIGHT - YARD_MARGIN;
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this.sprite);
  }
}
