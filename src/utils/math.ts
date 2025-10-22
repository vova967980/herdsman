export function isInsideYard(x: number, y: number, yardRect: { x: number; y: number; width: number; height: number }) {
  return (
    x >= yardRect.x &&
    x <= yardRect.x + yardRect.width &&
    y >= yardRect.y &&
    y <= yardRect.y + yardRect.height
  );
}
