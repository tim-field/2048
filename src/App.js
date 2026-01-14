import React, { useState, useEffect, useCallback } from "react"
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
} from "./2048"
import "./App.css"

const keyMove = {
  ArrowUp: moveUp,
  ArrowDown: moveDown,
  ArrowLeft: moveLeft,
  ArrowRight: moveRight,
}

const HIGH_SCORE_KEY = "twenty48_high_score"

function loadHighScore() {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    return null
  }
}

function saveHighScore(highestTile, timeInSeconds) {
  try {
    localStorage.setItem(
      HIGH_SCORE_KEY,
      JSON.stringify({ highestTile, timeInSeconds }),
    )
  } catch (e) {
    // Ignore localStorage errors
  }
}

function App() {
  const [board, setBoard] = useState(() => initBoard())
  const [gameOver, setGameOver] = useState(false)
  const [startTime, setStartTime] = useState(() => Date.now())
  const [highScore, setHighScore] = useState(() => loadHighScore())

  const restartGame = useCallback(() => {
    setBoard(initBoard())
    setGameOver(false)
    setStartTime(Date.now())
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      if (gameOver) {
        return
      }
      if (e.key in keyMove) {
        const newBoard = keyMove[e.key](board)
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
                    <td className={"tile" + " tile-" + value} key={y}>
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
