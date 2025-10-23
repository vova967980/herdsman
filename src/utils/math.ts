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

export function receiveValidCoordinates(restrictedRect: Rect, restrictedRectBuffer: number, sprite?: {
  x: number,
  y: number
}) {
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
    }) || sprite && lineIntersectsRect(
      sprite.x,
      sprite.y,
      x,
      y,
      restrictedRect
    )
    );

  return { x, y };
}

export function lineIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  const xMin = rect.x;
  const xMax = rect.x + rect.width;
  const yMin = rect.y;
  const yMax = rect.y + rect.height;

  const isValidX = (x1 < xMin && x2 < xMin) || (x1 > xMax && x2 > xMax);
  const isValidY = (y1 < yMin && y2 < yMin) || (y1 > yMax && y2 > yMax);

  if (isValidX || isValidY) return false;

  return true;
}
