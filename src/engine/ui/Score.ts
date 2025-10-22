import * as PIXI from 'pixi.js';
import { GAME_WIDTH } from '../../contstants';

const SCORE_COLOR = 0xffffff;
const SCORE_FONT_SIZE = 24;
const SCORE_PREFIX = 'Score: ';

export class Score {
  private text: PIXI.Text;
  private value = 0;

  constructor() {
    this.text = new PIXI.Text({
      text: SCORE_PREFIX + this.value,
      style: {
        fill: SCORE_COLOR,
        fontSize: SCORE_FONT_SIZE,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        align: 'center'
      }
    });

    this.text.anchor.set(0.5, 0);
    this.text.x = GAME_WIDTH / 2;
    this.text.y = 20;
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this.text);
  }

  setValue(newValue: number) {
    this.value = newValue;
    this.text.text = SCORE_PREFIX + this.value;
  }

  increase(amount = 1) {
    this.setValue(this.value + amount);
  }

  getValue() {
    return this.value;
  }
}
