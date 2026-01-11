# 2048 Game

A React implementation of the popular 2048 puzzle game. Combine numbered tiles to reach 2048!

## About

This is a web-based version of the 2048 game built with React. The game is played on a 4×4 grid, where tiles with numbers slide in one of four directions (up, down, left, or right). When two tiles with the same number touch, they merge into one tile with double the value. The goal is to create a tile with the number 2048.

## Features

- Clean and responsive UI
- Keyboard controls (arrow keys)
- Functional game logic with tile merging and shifting
- Built with React for smooth gameplay

## Getting Started

### Prerequisites

- Node.js (version 6 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tim-field/2048.git
   cd 2048
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game

Start the development server:
```bash
npm start
```

The game will open in your default browser at `http://localhost:3000`.

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The production-ready files will be in the `build` directory.

## How to Play

1. Use the **arrow keys** on your keyboard to move tiles:
   - **↑** (Up Arrow) - Move tiles up
   - **↓** (Down Arrow) - Move tiles down
   - **←** (Left Arrow) - Move tiles left
   - **→** (Right Arrow) - Move tiles right

2. When two tiles with the same number touch, they merge into one tile with their sum.

3. After each move, a new tile appears randomly on the board.

4. The goal is to create a tile with the number 2048.

## Testing

Run the test suite:
```bash
npm test
```

## Technology Stack

- **React** - UI framework
- **react-scripts** - Build tooling and configuration
- **Babel** - JavaScript transpiler
- **ES2015+** - Modern JavaScript features

## Project Structure

```
2048/
├── public/           # Static files
│   └── index.html    # HTML template
├── src/
│   ├── 2048.js       # Core game logic
│   ├── App.js        # Main React component
│   ├── App.css       # Component styles
│   ├── index.js      # Application entry point
│   ├── index.css     # Global styles
│   └── tests.js      # Test files
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## License

This project is available for personal and educational use.

## Acknowledgments

Inspired by the original 2048 game created by Gabriele Cirulli.
