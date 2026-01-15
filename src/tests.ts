import { initBoard, render, moveUp, moveLeft, moveRight } from "./2048.ts"

const board1 = initBoard()
const rendered1 = render(board1)
const movedRight = moveRight(rendered1)
if (movedRight) {
  const rendered2 = render(movedRight)
  const movedLeft = moveLeft(rendered2)
  if (movedLeft) {
    const rendered3 = render(movedLeft)
    const movedUp = moveUp(rendered3)
    if (movedUp) {
      render(movedUp)
    }
  }
}
