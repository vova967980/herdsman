import { Game } from './engine';

(async () => {
  const game = new Game();
  await game.init();
})();
