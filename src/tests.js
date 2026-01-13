import {
  initBoard,
  render,
  moveUp,
  moveLeft,
  moveRight,
  eachTile,
} from "./2048";

render(moveUp(render(moveLeft(render(moveRight(render(initBoard())))))));
