import React, { useState, useEffect, useCallback, useRef } from "react"
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

// Helper function to create tile objects with IDs for animation tracking
function boardToTiles(board) {
  const tiles = []
  let nextId = 0

  for (let x of getRowIndexes()) {
    for (let y of getColumnIndexes()) {
      const value = getValue(x, y, board)
      if (value) {
        tiles.push({
          id: `${x}-${y}-${value}-${nextId++}`,
          x,
          y,
          value,
        })
      }
    }
  }

  return tiles
}

function App() {
  const [board, setBoard] = useState(() => initBoard())
  const [tiles, setTiles] = useState(() => boardToTiles(initBoard()))
  const [gameOver, setGameOver] = useState(false)
  const [startTime, setStartTime] = useState(() => Date.now())
  const [highScore, setHighScore] = useState(() => loadHighScore())
  const nextTileIdRef = useRef(0)

  const restartGame = useCallback(() => {
    const newBoard = initBoard()
    setBoard(newBoard)
    setTiles(boardToTiles(newBoard))
    setGameOver(false)
    setStartTime(Date.now())
    nextTileIdRef.current = 0
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

          // Track tile movements by maintaining IDs
          const newTiles = []
          const usedIds = new Set()

          for (let x of getRowIndexes()) {
            for (let y of getColumnIndexes()) {
              const value = getValue(x, y, newBoard)
              if (value) {
                // Try to find a matching tile from the previous state
                // Prioritize tiles that are close to the current position
                const oldTile = tiles.find((t) => {
                  if (usedIds.has(t.id)) return false
                  if (t.value !== value) return false
                  // Prefer tiles that haven't moved too far
                  const distance = Math.abs(t.x - x) + Math.abs(t.y - y)
                  return distance <= 3 // Max distance in a 4x4 grid
                })

                if (oldTile) {
                  newTiles.push({
                    id: oldTile.id,
                    x,
                    y,
                    value,
                  })
                  usedIds.add(oldTile.id)
                } else {
                  // New tile created
                  newTiles.push({
                    id: `tile-${nextTileIdRef.current++}`,
                    x,
                    y,
                    value,
                  })
                }
              }
            }
          }

          setBoard(newBoard)
          setTiles(newTiles)
        }
      }
    },
    [board, gameOver, highScore, startTime, tiles],
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
        <div className="board-container">
          <div className="board-grid">
            {getRowIndexes().map((x) =>
              getColumnIndexes().map((y) => (
                <div key={`${x}-${y}`} className="grid-cell" />
              )),
            )}
          </div>
          <div className="tile-container">
            {tiles.map((tile) => (
              <div
                key={tile.id}
                className={`tile tile-${tile.value} tile-position-${tile.x}-${tile.y}`}
                style={{
                  transform: `translate(${tile.y * 122}px, ${tile.x * 122}px)`,
                }}
              >
                {tile.value}
              </div>
            ))}
          </div>
        </div>
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
