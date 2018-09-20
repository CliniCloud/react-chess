const general = require('./general')
const decode = require('../decode')
const pawn = require('./pawn')

/**
 * Create a king movement or attack for an especific position on the board
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} position king's position
 * @param {int} row board row
 * @param {int} col board column
 */
const getNextMovsAttacks = (pieces, piece, row, col) => {
    const newX = piece.x - col
    const column = general.getColumn(newX)
    const newY = piece.y - row
    if (column && general.isBetweenRange(newY)) {
        const squarePiece = general.findPieceAtPosition(pieces, `${column}${newY+1}`)
        if (squarePiece && !general.isPiecesFromSameTeam(squarePiece, piece)) {
            return {
                attack: {
                    x: newX,
                    y: newY
                }
            }
        } else if (!squarePiece) {
            return {
                nextMov: {
                    x: newX,
                    y: newY
                }
            }
        }
    }

    return null
}

/**
 * Create king's next movements and attacks
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 */
const createMovsAttacks = (pieces, piece) => {
    const nextMovements = []
    const attacks = []
    for (let col = -1; col < 2; col++) {
        for (let row = -1; row < 2; row++) {
            const result = getNextMovsAttacks(pieces, piece, row, col)
            if (result && result.nextMov) {
                nextMovements.push(result.nextMov)
            } else if (result && result.attack) {
                attacks.push(result.attack)
            }
        }
    }

    return {
        nextMovements,
        attacks
    }
}

/**
 * Add castling movements for kings's next movements
 * @param {array} pieces all current pieces
 * @param {number} kingsYPos kings Y position 
 * @param {string} type castle side type
 */
const getCastlingPos = (pieces, kingsYPos, type) => {
    const rookY = kingsYPos + 1
    const rookData = {}

    if (type === 'left') {
        rookData.column = 'a'
        rookData.hasEmptySpace = !general.findPieceAtPosition(pieces, `b${rookY}`) && !general.findPieceAtPosition(pieces, `c${rookY}`) && !general.findPieceAtPosition(pieces, `d${rookY}`)
        rookData.nextColumn = 'd'
        rookData.x = 2
    } else {
        rookData.column = 'h'
        rookData.hasEmptySpace = !general.findPieceAtPosition(pieces, `f${rookY}`) && !general.findPieceAtPosition(pieces, `g${rookY}`)
        rookData.nextColumn = 'f'
        rookData.x = 6
    }

    const rook = general.findPieceAtPosition(pieces, `${rookData.column}${rookY}`)
    if (rook && rook.name.toUpperCase() === 'R' && rook.qntPlayed === 0 && rookData.hasEmptySpace) {
        rook.nextPos = `${rookData.nextColumn}${rookY}`
        return {
            x: rookData.x,
            y: kingsYPos,
            rookPos: rook
        }
    }

    return null
}

/**
 * Remove all enemy possible attacks (except pawns because their attacks are different than thier movements)
 * from king's next movements
 * @param {array} currNextMovements current king's next movements
 * @param {array} enemyPossibleAttacks enemy possible attacks
 */
const removeNextMovsByEnemyMovs = (currNextMovements, enemyPossibleAttacks) =>
    currNextMovements.map(nextMom => {
        for (const enemy of general.filterByTypeOfPieces(enemyPossibleAttacks,'KQRNB')) {
            for (const enemyMov of enemy.nextMovements) {
                if (enemyMov.x === nextMom.x && enemyMov.y === nextMom.y) {
                    return false
                }
            }
        }
        return nextMom
    }).filter(Boolean)

/**
 * Remove all enemy pawns possible attacks from king's next movements
 * @param {array} pieces all current pieces
 * @param {string} pieceName king piece name
 * @param {array} currNextMovements current king next movements
 */
const removeNextMovsByEnemyPawsMovs = (pieces, pieceName, currNextMovements) =>
    currNextMovements.map(nextMom => {
        const foundItem = pawn.getEnemyPawnsAttacks(pieces, general.whatIsEnemyTeam(pieceName)).find(pawnAttack => pawnAttack.x === nextMom.x && pawnAttack.y === nextMom.y)
        return foundItem ? false : nextMom
    }).filter(Boolean)

/**
 * Get next movements and attacks of king
 * @param {array} pieces string array with all current pieces
 * @param {object} piece decoded piece
 * @param {array} enemyPossibleMovs list with enemy possible moves
 * @param {object} threateningPos posistion of enemy threatening
 */
const getOptions = (pieces, piece, enemyPossibleMovs, threateningPos) => {
    const newPiece = piece.x ? piece : decode.fromPieceDecl(piece.notation)
    const result = createMovsAttacks(pieces, newPiece)
    const attacks = result.attacks
    let nextMovements = result.nextMovements

    if (!threateningPos && !newPiece.qntPlayed) {
        const castelingLeft = getCastlingPos(pieces, newPiece.y, 'left')
        if (castelingLeft) {
            nextMovements.push(castelingLeft)
        }
        const castelingRight = getCastlingPos(pieces, newPiece.y, 'right')
        if (castelingRight) {
            nextMovements.push(castelingRight)
        }
    }

    if (enemyPossibleMovs && enemyPossibleMovs.length) {
        nextMovements = removeNextMovsByEnemyMovs(nextMovements, enemyPossibleMovs)
        nextMovements = removeNextMovsByEnemyPawsMovs(pieces, newPiece.piece, nextMovements)
    }

    return {
        nextMovements,
        attacks
    }
}

let API = {
    getOptions,
}

if(general.isTestEnv()){
    API = Object.assign({}, API, {
        getNextMovsAttacks,
        createMovsAttacks,
        getCastlingPos,
        removeNextMovsByEnemyMovs,
        removeNextMovsByEnemyPawsMovs,
    })
}

module.exports = API
