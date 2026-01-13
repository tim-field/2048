const width = 4;
const height = 4;

export function initBoard() {
    return addValue(1, 1, 2, []);
}

export function render(board) {
    eachTile(board).map(([x, y, value]) => {
        if (y === 0) {
            if (x === 0) {
                process.stdout.write('\n========================\n')
            } else {
                process.stdout.write('\n')
            }
        }
        process.stdout.write(value ? '[  ' + value + ' ]' : '[    ]')
        //process.stdout.write('[  '+ x +', '+ y +' ]' )
    })
    return board
}

export function eachTile(board) {

    const tiles = []

    for (let x of getRowIndexes()) {
        for (let y of getColumnIndexes()) {
            tiles.push([x, y, getValue(x, y, board)])
        }
    }

    return tiles
}

export function getRowIndexes() {
    return [...Array(width).keys()]
}

export function getColumnIndexes() {
    return [...Array(height).keys()]
}

function renderTile(x, y, board) {
    const output = empty(x, y, board) ?
        '[    ]' :
        '[  ' + board[x][y] + ' ]'

    process.stdout.write(output)
}

export function empty(x, y, board) {
    return (typeof board[x] === 'undefined' || typeof board[x][y] === 'undefined')
}

export function getValue(x, y, board) {
    return empty(x, y, board) ? null : board[x][y]
}

function addValue(x, y, value, board) {

    if (typeof value !== 'undefined') {

        if (typeof board[x] === 'undefined') {
            board[x] = [];
        }

        board[x] = addToRow(y, value, board[x])

    }

    return board
}

function addToRow(x, value, row) {
    if (!Array.isArray(row)) {
        row = []
    }
    row[x] = value
    return row
}

export function moveRight(board) {
    try {
        return eachRow(
            addNewValue(
                eachRow(
                    eachRow(
                        board,
                        shiftRight
                    ),
                    sumRight
                )
            ),
            shiftRight
        )
    } catch (e) {
        if (e.message === 'board full') {
            return null
        }
        throw e
    }
}

export function moveLeft(board) {
    try {
        return eachRow(
            addNewValue(
                eachRow(
                    eachRow(
                        board,
                        shiftLeft
                    ),
                    sumLeft
                )
            ),
            shiftLeft
        )
    } catch (e) {
        if (e.message === 'board full') {
            return null
        }
        throw e
    }
}

export function moveUp(board) {
    const result = moveLeft(flip(board))
    return result !== null ? flip(result) : null
}

export function moveDown(board) {
    const result = moveRight(flip(board))
    return result !== null ? flip(result) : null
}

function eachRow(board, func) {
    return board.map((row) => row ? func(row) : row)
}

function shiftRight(row) {
    return shift(row, false)
}

function shiftLeft(row) {
    return shift(row, true)
}

function shift(row, left = true) {
    const reduce = left ? 'reduce' : 'reduceRight';
    return row[reduce]((newRow, value) => addTo(newRow, value, left), [])
}

function addTo(row, value, left = true) {
    const size = row.filter(Boolean).length
    const index = left ? size : (width - size - 1)
    row[index] = value
    return row
}

function sumRight(row) {
    return row.reduceRight((right, value, x) => {
        if (value && x > 0 && value === row[x - 1]) {
            right[x] = value * 2
            delete row[x - 1]
        } else {
            right[x] = value
        }
        return right
    }, [])
}

function sumLeft(row) {
    return row.reduce((left, value, x) => {
        if (value && x < width && value === row[x + 1]) {
            left[x] = value * 2
            delete row[x + 1]
        }
        else {
            left[x] = value
        }
        return left
    }, [])
}

function flip(board) {
    return eachTile(board).reduce((flipped, [x, y, value]) => addValue(y, x, value, flipped), [])
}

function getEmptyTiles(board) {
    return eachTile(board).reduce((empties, [x, y, value]) => {
        if (!value) {
            empties.push([x, y])
        }
        return empties
    }, [])
}

function addNewValue(board) {
    const empties = getEmptyTiles(board)
    if (!empties.length) {
        throw new Error('board full')
    }
    const random = Math.random();
    const [x, y] = empties[~~(random * empties.length)]
    return addValue(x, y, (random >= .9 ? 4 : 2), board)
}
