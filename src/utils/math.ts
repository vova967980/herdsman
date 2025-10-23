import { GAME_HEIGHT, GAME_WIDTH } from '../contstants';
import { Rect } from '../types';

export function isInsideRect(x: number, y: number, yardRect: { x: number; y: number; width: number; height: number }) {
  return (
    x >= yardRect.x &&
    x <= yardRect.x + yardRect.width &&
    y >= yardRect.y &&
    y <= yardRect.y + yardRect.height
  );
}

export function receiveValidCoordinates(restrictedRect: Rect, restrictedRectBuffer: number) {
  let x: number, y: number;

  do {
    x = Math.random() * GAME_WIDTH;
    y = Math.random() * GAME_HEIGHT;
  } while (
    isInsideRect(x, y, {
      x: restrictedRect.x - restrictedRectBuffer,
      y: restrictedRect.y - restrictedRectBuffer,
      width: restrictedRect.width + restrictedRectBuffer * 2,
      height: restrictedRect.height + restrictedRectBuffer * 2
    })
    );

  return { x, y };
}
