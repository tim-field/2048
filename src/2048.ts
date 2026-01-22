const width = 4
const height = 4

let nextTileId = 1

export function getNextTileId(): number {
  return nextTileId++
}

export function resetTileIdCounter(): void {
  nextTileId = 1
}

export interface TileData {
  id: number
  value: number
}

export type TileValue = TileData | null | undefined
export type Row = TileValue[]
export type Board = Row[]
export type Tile = [number, number, TileValue]
export type EmptyTile = [number, number]

export function createTile(value: number): TileData {
  return { id: getNextTileId(), value }
}

export function initBoard(): Board {
  resetTileIdCounter()
  return addValue(1, 1, createTile(2), [])
}

export function render(board: Board): Board {
  eachTile(board).map(([x, y, tile]) => {
    if (y === 0) {
      if (x === 0) {
        process.stdout.write("\n========================\n")
      } else {
        process.stdout.write("\n")
      }
    }
    process.stdout.write(tile ? "[  " + String(tile.value) + " ]" : "[    ]")
  })
  return board
}

export function eachTile(board: Board): Tile[] {
  const tiles: Tile[] = []

  for (const x of getRowIndexes()) {
    for (const y of getColumnIndexes()) {
      tiles.push([x, y, getTile(x, y, board)])
    }
  }

  return tiles
}

export function getRowIndexes(): number[] {
  return [...Array(width).keys()]
}

export function getColumnIndexes(): number[] {
  return [...Array(height).keys()]
}

export function empty(x: number, y: number, board: Board): boolean {
  return typeof board[x] === "undefined" || typeof board[x]?.[y] === "undefined"
}

export function getTile(x: number, y: number, board: Board): TileValue {
  return empty(x, y, board) ? null : board[x]?.[y]
}

function addValue(x: number, y: number, value: TileValue, board: Board): Board {
  if (typeof value !== "undefined" && value !== null) {
    if (typeof board[x] === "undefined") {
      board[x] = []
    }

    const row = board[x]
    if (row) {
      board[x] = addToRow(y, value, row)
    }
  }

  return board
}

function addToRow(x: number, value: TileValue, row: Row): Row {
  if (!Array.isArray(row)) {
    row = []
  }
  row[x] = value
  return row
}

export function moveRight(board: Board): Board | null {
  try {
    return eachRow(
      addNewValue(eachRow(eachRow(board, shiftRight), sumRight)),
      shiftRight,
    )
  } catch (e) {
    if (e instanceof Error && e.message === "board full") {
      return null
    }
    throw e
  }
}

export function moveLeft(board: Board): Board | null {
  try {
    return eachRow(
      addNewValue(eachRow(eachRow(board, shiftLeft), sumLeft)),
      shiftLeft,
    )
  } catch (e) {
    if (e instanceof Error && e.message === "board full") {
      return null
    }
    throw e
  }
}

export function moveUp(board: Board): Board | null {
  const result = moveLeft(flip(board))
  return result !== null ? flip(result) : null
}

export function moveDown(board: Board): Board | null {
  const result = moveRight(flip(board))
  return result !== null ? flip(result) : null
}

function eachRow(board: Board, func: (row: Row) => Row): Board {
  return board.map((row) => (row ? func(row) : row))
}

function shiftRight(row: Row): Row {
  return shift(row, false)
}

function shiftLeft(row: Row): Row {
  return shift(row, true)
}

function shift(row: Row, left = true): Row {
  const reduce = left ? "reduce" : "reduceRight"
  return row[reduce]<Row>((newRow, value) => addTo(newRow, value, left), [])
}

function addTo(row: Row, value: TileValue, left = true): Row {
  const size = row.filter(Boolean).length
  const index = left ? size : width - size - 1
  row[index] = value
  return row
}

function sumRight(row: Row): Row {
  return row.reduceRight<Row>((right, tile, x) => {
    const prevTile = row[x - 1]
    if (tile && x > 0 && prevTile && tile.value === prevTile.value) {
      right[x] = createTile(tile.value * 2)
      delete row[x - 1]
    } else {
      right[x] = tile
    }
    return right
  }, [])
}

function sumLeft(row: Row): Row {
  return row.reduce<Row>((left, tile, x) => {
    const nextTile = row[x + 1]
    if (tile && x < width && nextTile && tile.value === nextTile.value) {
      left[x] = createTile(tile.value * 2)
      delete row[x + 1]
    } else {
      left[x] = tile
    }
    return left
  }, [])
}

function flip(board: Board): Board {
  return eachTile(board).reduce<Board>(
    (flipped, [x, y, value]) => addValue(y, x, value, flipped),
    [],
  )
}

function getEmptyTiles(board: Board): EmptyTile[] {
  return eachTile(board)
    .filter(([, , value]) => !value)
    .map(([x, y]) => [x, y] as EmptyTile)
}

function addNewValue(board: Board): Board {
  const empties = getEmptyTiles(board)
  if (!empties.length) {
    throw new Error("board full")
  }
  const random = Math.random()
  const emptyTile = empties[~~(random * empties.length)]
  if (!emptyTile) {
    throw new Error("board full")
  }
  const [x, y] = emptyTile
  return addValue(x, y, createTile(random >= 0.9 ? 4 : 2), board)
}

export function getHighestTile(board: Board): number {
  return Math.max(0, ...eachTile(board).map(([, , tile]) => tile?.value ?? 0))
}
