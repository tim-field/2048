import { useState, useEffect, useCallback, useRef } from "react"
import confetti from "canvas-confetti"
import type { Board } from "./2048.ts"
import {
  initBoard,
  getRowIndexes,
  getColumnIndexes,
  getValue,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  getHighestTile,
} from "./2048.ts"
import "./App.css"

const WINNING_TILE = 2048

type MoveFunction = (board: Board) => Board | null

const keyMove: Record<string, MoveFunction> = {
  ArrowUp: moveUp,
  ArrowDown: moveDown,
  ArrowLeft: moveLeft,
  ArrowRight: moveRight,
}

const HIGH_SCORE_KEY = "twenty48_high_score"

interface HighScore {
  highestTile: number
  timeInSeconds: number
}

function loadHighScore(): HighScore | null {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY)
    return stored ? (JSON.parse(stored) as HighScore) : null
  } catch {
    return null
  }
}

function saveHighScore(highestTile: number, timeInSeconds: number): void {
  try {
    localStorage.setItem(
      HIGH_SCORE_KEY,
      JSON.stringify({ highestTile, timeInSeconds }),
    )
  } catch {
    // Ignore localStorage errors
  }
}

function triggerConfetti(): void {
  const duration = 3000
  const end = Date.now() + duration

  const frame = (): void => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

function App(): React.JSX.Element {
  const [board, setBoard] = useState<Board>(() => initBoard())
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [startTime, setStartTime] = useState<number>(() => Date.now())
  const [highScore, setHighScore] = useState<HighScore | null>(() =>
    loadHighScore(),
  )
  const hasWonRef = useRef<boolean>(false)

  const restartGame = useCallback(() => {
    setBoard(initBoard())
    setGameOver(false)
    setStartTime(Date.now())
    hasWonRef.current = false
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) {
        return
      }
      if (e.key in keyMove) {
        const moveFunction = keyMove[e.key]
        if (!moveFunction) {
          return
        }
        const newBoard = moveFunction(board)
        if (newBoard === null) {
          const highestTile = getHighestTile(board)
          const timeInSeconds = Math.floor((Date.now() - startTime) / 1000)

          if (!highScore || highestTile > highScore.highestTile) {
            saveHighScore(highestTile, timeInSeconds)
            setHighScore({ highestTile, timeInSeconds })
          }
          setGameOver(true)
        } else {
          const highestTile = getHighestTile(newBoard)

          if (!highScore || highestTile > highScore.highestTile) {
            const timeInSeconds = Math.floor((Date.now() - startTime) / 1000)
            saveHighScore(highestTile, timeInSeconds)
            setHighScore({ highestTile, timeInSeconds })
          }

          if (highestTile >= WINNING_TILE && !hasWonRef.current) {
            hasWonRef.current = true
            triggerConfetti()
          }

          setBoard(newBoard)
        }
      }
    },
    [board, gameOver, highScore, startTime],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const currentScore = getHighestTile(board)
  const currentTimeInSeconds = Math.floor((Date.now() - startTime) / 1000)

  return (
    <div className="App">
      <div className="scores-container">
        <div className="score-box">
          <div className="score-label">Score</div>
          <div className="score-value">{currentScore}</div>
          <div className="score-time">
            Time: {Math.floor(currentTimeInSeconds / 60)}:
            {String(currentTimeInSeconds % 60).padStart(2, "0")}
          </div>
        </div>
        {highScore && (
          <div className="score-box">
            <div className="score-label">Best</div>
            <div className="score-value">{highScore.highestTile}</div>
            <div className="score-time">
              Time: {Math.floor(highScore.timeInSeconds / 60)}:
              {String(highScore.timeInSeconds % 60).padStart(2, "0")}
            </div>
          </div>
        )}
      </div>
      <div className="Grid">
        <table className="board">
          <tbody>
            {getRowIndexes().map((x) => (
              <tr key={x}>
                {getColumnIndexes().map((y) => {
                  const value = getValue(x, y, board)

                  return (
                    <td className={"tile" + " tile-" + String(value)} key={y}>
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-text">Game Over</div>
            <button className="restart-button" onClick={restartGame}>
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
