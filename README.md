# 2048

A React-based implementation of the classic 2048 puzzle game. Slide tiles on a 4x4 grid using arrow keys to combine matching numbers and reach the 2048 tile.

## How to Play

Use the arrow keys to move all tiles in a direction. When two tiles with the same number collide, they merge into one tile with their combined value. After each move, a new tile (2 or 4) appears in a random empty spot. The game ends when no more moves are possible.

The goal is to create a tile with the value 2048, though you can continue playing to achieve even higher scores.

## Features

- Classic 2048 gameplay on a 4x4 grid
- Score tracking showing your current highest tile
- High score persistence using localStorage
- Timer tracking how long you've been playing
- Game over detection with restart option
- Smooth tile animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

```bash
git clone https://github.com/tim-field/2048.git
cd 2048
npm install
```

### Running the Game

Start the development server:

```bash
npm start
```

The game will open automatically in your browser at http://localhost:3000.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

## Development

### Available Scripts

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm start`            | Start development server on port 3000         |
| `npm run build`        | Build production bundle                       |
| `npm run format`       | Format code with Prettier                     |
| `npm run format:check` | Check code formatting without modifying files |

### Project Structure

```
src/
  index.js          # Application entry point
  App.js            # Main React component with game UI and state management
  App.css           # Styles for the game board and UI
  2048.js           # Core game logic (pure functions)
  tests.js          # Integration tests
  index.css         # Global styles

public/
  index.html        # HTML template
  favicon.ico       # Game favicon

webpack.config.js   # Webpack configuration
```

### Architecture

The codebase follows a clean separation of concerns:

- **Game Logic** (`2048.js`): Pure functions for board manipulation including `moveUp`, `moveDown`, `moveLeft`, and `moveRight`. The board is represented as a 2D sparse array where empty tiles are undefined/null values.

- **UI Component** (`App.js`): React class component handling keyboard input, game state, and rendering. Arrow key events are captured at the window level.

- **State Management**: React component state manages the current board and game status, while localStorage persists high scores across sessions.

### Code Style

This project uses Prettier for code formatting with the following configuration:

- No semicolons
- Double quotes

Run `npm run format` before committing code to ensure consistent formatting.

## Technology Stack

- React 19
- Webpack 5 with webpack-dev-server
- Babel for transpilation
- Prettier for code formatting

## License

This project is open source.
