# Copilot Instructions for 2048 Game

## Project Overview

This is a React-based implementation of the classic 2048 game. Players use arrow keys to move tiles on a 4x4 grid, combining tiles with the same value to reach higher numbers. The game tracks high scores using localStorage.

## Technology Stack

- **Frontend Framework**: React 19.2.3 with Class Components
- **Build Tool**: Webpack 5 with webpack-dev-server
- **Transpiler**: Babel (with @babel/preset-env and @babel/preset-react)
- **Code Formatting**: Prettier

## Development Commands

- `npm start` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files

## Code Style Guidelines

### Prettier Configuration

- **No semicolons**: `"semi": false`
- **Double quotes**: `"singleQuote": false`
- Always run `npm run format` before committing code

### JavaScript/React Conventions

- Use ES6+ syntax (arrow functions, destructuring, template literals)
- Use Class Components for stateful components (existing pattern in this project)
- Functional programming style for game logic (see `2048.js`)
- Avoid mutating state directly - always use `setState` in React components
- Use meaningful variable names (`highestTile`, not `ht`)

## Project Structure

```
/src
  ├── index.js          # Application entry point
  ├── App.js            # Main React component with game UI and state management
  ├── App.css           # Styles for the game board and UI
  ├── 2048.js           # Core game logic (pure functions)
  ├── tests.js          # Simple integration test
  └── index.css         # Global styles

/public
  └── index.html        # HTML template

/webpack.config.js      # Webpack configuration
```

## Key Architecture Patterns

### Separation of Concerns

- **Game Logic** (`2048.js`): Pure functions for board manipulation (moveUp, moveDown, moveLeft, moveRight)
- **UI Component** (`App.js`): React component handling user input and rendering
- **State Management**: React class component state, localStorage for persistence

### Board Representation

- Board is represented as a 2D sparse array
- 4x4 grid (width × height)
- Empty tiles are undefined/null values
- Functions use immutable patterns (return new boards rather than mutating)

### Game Logic Functions

Key functions in `2048.js`:

- `initBoard()` - Creates initial board with one tile
- `moveUp/Down/Left/Right()` - Handle directional moves
- `getValue(x, y, board)` - Get tile value at position
- `getHighestTile(board)` - Find max tile value
- `flip(board)` - Transpose board (used for up/down moves)

## Testing Approach

- Current testing is minimal (see `tests.js`)
- When adding tests, follow the existing pattern of importing and testing pure functions
- Focus on testing game logic functions in `2048.js` as they are pure and deterministic
- UI testing should verify keyboard event handling and state updates

## High Score Feature

- Stored in localStorage with key `"twenty48_high_score"`
- Contains `{ highestTile, timeInSeconds }`
- Updated when player achieves a new high tile value
- Gracefully handles localStorage errors

## Important Notes

- Arrow key events are captured at window level
- Game over occurs when the board is full (no empty tiles remain). Move functions return `null` when they cannot add a new tile, which triggers game over in the UI
- New tiles are added randomly (90% chance of 2, 10% chance of 4)
- Always check for game over state before processing moves

## When Making Changes

1. **Adding Features**: Keep game logic in `2048.js` as pure functions, UI handling in `App.js`
2. **Styling**: Use CSS class naming convention `tile-{value}` for tile-specific styles
3. **State Updates**: Always use `setState` and maintain immutability
4. **Error Handling**: Gracefully handle localStorage errors and edge cases
5. **Testing**: Test pure functions in isolation when possible
6. **Formatting**: Run `npm run format` before committing

## Debugging

- Use `render(board)` function from `2048.js` to visualize board state in console
- Check browser console for any React warnings
- Use React DevTools for component state inspection
