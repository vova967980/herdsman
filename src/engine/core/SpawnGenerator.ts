import * as PIXI from 'pixi.js';
import { receiveValidCoordinates } from '../../utils';
import {
  SPAWN_INTERVAL_MIN,
  SPAWN_INTERVAL_MAX
} from '../../contstants';
import { Rect } from '../../types';

export class SpawnGenerator<T extends { addToStage: (stage: PIXI.Container) => void }> {
  private app: PIXI.Application;
  private readonly createEntity: (x: number, y: number) => T;
  private readonly restrictedRect: Rect;
  private readonly restrictedRectBuffer: number;
  private running = false;
  private readonly getActiveCount: () => number;
  private readonly maxEntities: number;
  private readonly onSpawn: (entity: T) => void;

  constructor(options: {
    app: PIXI.Application;
    createEntity: (x: number, y: number) => T;
    restrictedRect: Rect;
    restrictedRectBuffer: number;
    getActiveCount: () => number;
    maxEntities: number;
    onSpawn: (entity: T) => void;
  }) {
    this.app = options.app;
    this.createEntity = options.createEntity;
    this.restrictedRect = options.restrictedRect;
    this.restrictedRectBuffer = options.restrictedRectBuffer;
    this.getActiveCount = options.getActiveCount;
    this.maxEntities = options.maxEntities;
    this.onSpawn = options.onSpawn;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.scheduleNextSpawn();
  }

  stop() {
    this.running = false;
  }

  private scheduleNextSpawn() {
    if (!this.running) return;

    const delay =
      Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN) +
      SPAWN_INTERVAL_MIN;

    setTimeout(() => {
      if (!this.running) return;

      if (this.getActiveCount() < this.maxEntities) {
        const entity = this.spawnEntity();
        this.onSpawn?.(entity);
      }

      this.scheduleNextSpawn();
    }, delay);
  }

  public spawnEntity(): T {
    const { x, y } = receiveValidCoordinates(this.restrictedRect, this.restrictedRectBuffer);

    const entity = this.createEntity(x, y);
    entity.addToStage(this.app.stage);
    return entity;
  }
}
