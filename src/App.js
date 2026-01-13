import React, { Component } from "react"
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

// High score utilities
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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: initBoard(),
      gameOver: false,
      startTime: Date.now(),
      highScore: loadHighScore(),
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.restartGame = this.restartGame.bind(this)
  }

  restartGame() {
    this.setState({
      board: initBoard(),
      gameOver: false,
      startTime: Date.now(),
    })
  }

  handleKeyDown(e) {
    if (this.state.gameOver) {
      return
    }
    if (e.key in keyMove) {
      const newBoard = keyMove[e.key](this.state.board)
      if (newBoard === null) {
        // Game over - check and save high score
        const highestTile = getHighestTile(this.state.board)
        const timeInSeconds = Math.floor(
          (Date.now() - this.state.startTime) / 1000,
        )
        const currentHighScore = this.state.highScore

        if (!currentHighScore || highestTile > currentHighScore.highestTile) {
          saveHighScore(highestTile, timeInSeconds)
          this.setState({
            gameOver: true,
            highScore: { highestTile, timeInSeconds },
          })
        } else {
          this.setState({
            gameOver: true,
          })
        }
      } else {
        // Check if we've achieved a new high during play
        const highestTile = getHighestTile(newBoard)
        const currentHighScore = this.state.highScore

        if (!currentHighScore || highestTile > currentHighScore.highestTile) {
          const timeInSeconds = Math.floor(
            (Date.now() - this.state.startTime) / 1000,
          )
          saveHighScore(highestTile, timeInSeconds)
          this.setState({
            board: newBoard,
            highScore: { highestTile, timeInSeconds },
          })
        } else {
          this.setState({
            board: newBoard,
          })
        }
      }
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown)
  }

  render() {
    const { highScore, board, startTime } = this.state
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
                    const value = getValue(x, y, this.state.board)

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
          {this.state.gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-text">Game Over</div>
              <button className="restart-button" onClick={this.restartGame}>
                Restart
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App
