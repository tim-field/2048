import { useState, useEffect, useCallback, useRef } from "react"
import confetti from "canvas-confetti"
import type { Board, TileData } from "./2048.ts"
import {
  initBoard,
  getRowIndexes,
  getColumnIndexes,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  getHighestTile,
  eachTile,
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
  const [newTiles, setNewTiles] = useState<Set<number>>(new Set())
  const [tileTransforms, setTileTransforms] = useState<
    Map<number, { deltaRow: number; deltaCol: number }>
  >(new Map())

  const restartGame = useCallback(() => {
    const newBoard = initBoard()
    setBoard(newBoard)
    setGameOver(false)
    setStartTime(Date.now())
    hasWonRef.current = false
    setTileTransforms(new Map())

    // Mark the initial tile as new
    const tiles = eachTile(newBoard)
    const initialTileIds = tiles
      .filter(([, , tile]) => tile !== null)
      .map(([, , tile]) => tile?.id)
      .filter((id): id is number => id !== undefined)
    setNewTiles(new Set(initialTileIds))
    setTimeout(() => setNewTiles(new Set()), 200)
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

          // Store previous positions before the move
          const previousPositions = new Map<number, { x: number; y: number }>()
          eachTile(board).forEach(([x, y, tile]) => {
            if (tile?.id !== undefined) {
              previousPositions.set(tile.id, { x, y })
            }
          })

          // Calculate transforms for tiles that moved
          const transforms = new Map<
            number,
            { deltaRow: number; deltaCol: number }
          >()
          eachTile(newBoard).forEach(([newX, newY, tile]) => {
            if (tile?.id !== undefined) {
              const prevPos = previousPositions.get(tile.id)
              if (prevPos && (prevPos.x !== newX || prevPos.y !== newY)) {
                transforms.set(tile.id, {
                  deltaRow: prevPos.x - newX,
                  deltaCol: prevPos.y - newY,
                })
              }
            }
          })

          // Track which tiles are new (didn't exist before)
          const oldTileIds = new Set(
            eachTile(board)
              .filter(([, , tile]) => tile !== null)
              .map(([, , tile]) => tile?.id)
              .filter((id): id is number => id !== undefined),
          )
          const newlyCreated = new Set(
            eachTile(newBoard)
              .filter(([, , tile]) => tile !== null)
              .map(([, , tile]) => tile?.id)
              .filter(
                (id): id is number => id !== undefined && !oldTileIds.has(id),
              ),
          )

          // Set transforms first (tiles appear at old positions)
          setTileTransforms(transforms)
          setNewTiles(newlyCreated)
          setBoard(newBoard)

          // Use requestAnimationFrame to clear transforms on next frame
          // This triggers the CSS transition animation
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTileTransforms(new Map())
            })
          })

          // Clear new tile animation after it completes
          setTimeout(() => {
            setNewTiles(new Set())
          }, 200)
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

  // Collect all tiles for rendering
  const tiles: Array<{
    x: number
    y: number
    tile: TileData
    isNew: boolean
    transform?: { deltaRow: number; deltaCol: number }
  }> = []

  eachTile(board).forEach(([x, y, tileData]) => {
    if (tileData) {
      const tileId = tileData.id
      const isNew = newTiles.has(tileId)
      const transform = tileTransforms.get(tileId)

      const tileInfo: (typeof tiles)[number] = {
        x,
        y,
        tile: tileData,
        isNew,
      }
      if (transform) {
        tileInfo.transform = transform
      }
      tiles.push(tileInfo)
    }
  })

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
        <div className="board">
          {/* Background grid cells */}
          {getRowIndexes().map((x) =>
            getColumnIndexes().map((y) => (
              <div key={`cell-${x}-${y}`} className="cell" />
            )),
          )}
          {/* Tiles layer */}
          {tiles.map(({ x, y, tile, isNew, transform }) => {
            // Cell size (107px) + gap (15px) = 122px per cell
            const cellSize = 122

            const style: React.CSSProperties = {
              gridRow: x + 1,
              gridColumn: y + 1,
            }

            // Apply transform for movement animation
            if (transform) {
              style.transform = `translate(${transform.deltaCol * cellSize}px, ${transform.deltaRow * cellSize}px)`
            }

            return (
              <div
                key={tile.id}
                className={
                  "tile tile-" + String(tile.value) + (isNew ? " tile-new" : "")
                }
                style={style}
                data-tile-id={tile.id}
              >
                {tile.value}
              </div>
            )
          })}
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
