# 2048 Game

A browser-based implementation of the popular 2048 puzzle game built with React.

## About

2048 is a sliding tile puzzle game where you combine numbered tiles to reach the 2048 tile. Use arrow keys to move tiles in four directions - when two tiles with the same number touch, they merge into one with their sum. The game tracks your high score and time to keep you motivated!

## Features

- 🎮 Classic 2048 gameplay on a 4x4 grid
- ⌨️ Keyboard controls (Arrow keys)
- 🏆 High score tracking with localStorage persistence
- ⏱️ Timer to track how long it takes to achieve your best score
- 🎨 Color-coded tiles for easy visual recognition
- 🔄 Restart button to start a new game
- 📱 Responsive design

## Demo

The game displays a 4x4 grid of tiles. Use arrow keys to move all tiles in the chosen direction. When two tiles with the same number collide, they merge into one tile with double the value. The goal is to create a tile with the number 2048 (or go even higher!).

## Installation

### Prerequisites

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/tim-field/2048.git
cd 2048
```

2. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

Start the development server with hot-reloading:

```bash
npm start
```

The game will automatically open in your browser at `http://localhost:3000`.

### Production Build

Create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## How to Play

1. **Start**: When the game loads, you'll see a 4x4 grid with one or two tiles
2. **Move**: Use the arrow keys (↑ ↓ ← →) to slide tiles in any direction
3. **Merge**: When two tiles with the same number collide, they merge into one tile with their sum
4. **Win**: Reach the 2048 tile (or keep going for an even higher score!)
5. **Game Over**: The game ends when no more moves are possible
6. **Restart**: Click the "Restart" button to start a new game

### Tips

- Plan your moves carefully - random sliding won't get you far!
- Try to keep your highest tile in a corner
- Build tiles in a sequential pattern
- Don't spread high-value tiles across the board

## Development

### Available Scripts

- `npm start` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files

### Technology Stack

- **Frontend Framework**: React 19.2.3 (with Class Components)
- **Build Tool**: Webpack 5
- **Module Bundler**: webpack-dev-server 5
- **Transpiler**: Babel (with @babel/preset-env and @babel/preset-react)
- **Code Formatter**: Prettier
- **Styling**: CSS

### Project Structure

```
/src
  ├── index.js          # Application entry point
  ├── App.js            # Main React component with game UI and state management
  ├── App.css           # Styles for the game board and UI
  ├── 2048.js           # Core game logic (pure functions)
  ├── tests.js          # Simple integration test
  └── index.css         # Global styles

/public
  ├── index.html        # HTML template
  └── favicon.ico       # Favicon

/webpack.config.js      # Webpack configuration
```

### Code Style

This project uses Prettier for code formatting:

- No semicolons
- Double quotes
- Run `npm run format` before committing code

### Architecture

The game follows a clean separation of concerns:

- **Game Logic** (`src/2048.js`): Pure functions for board manipulation
- **UI Component** (`src/App.js`): React component handling user input and rendering
- **State Management**: React class component state with localStorage for high score persistence

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

### Guidelines

1. Follow the existing code style (use Prettier)
2. Keep game logic as pure functions
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is available for personal and educational use.

## Acknowledgments

Inspired by the original 2048 game created by Gabriele Cirulli.
