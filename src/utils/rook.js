const general = require('./general')
const decode = require('../decode')

const getOptions = (pieces, piece, threateningPos) => {
    const position = decode.fromPieceDecl(piece.notation)
    const result = {
        nexMovsAfterKing: [],
        nextAttacksAfterKing: [],
        nextMovements: [],
        attacks: []
    }

    let endedDirection = {
        left: false,
        right: false,
        top: false,
        down: false
    }

    for (let col = position.x; col > -1; col--) {
        for (let row = 0; row < 8; row++) {
            const rookResult = generateRookPos(pieces, piece, position, endedDirection, col, row, 'left')
            createRookResult(result, rookResult)
        }
    }

    for (let col = position.x; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const rookResult = generateRookPos(pieces, piece, position, endedDirection, col, row, 'right')
            createRookResult(result, rookResult)
        }
    }


    for (let col = 0; col < 8; col++) {
        for (let row = position.y; row > -1; row--) {
            const rookResult = generateRookPos(pieces, piece, position, endedDirection, col, row, 'down')
            createRookResult(result, rookResult)
        }
    }

    for (let col = 0; col < 8; col++) {
        for (let row = position.y; row < 8; row++) {
            const rookResult = generateRookPos(pieces, piece, position, endedDirection, col, row, 'top')
            createRookResult(result, rookResult)
        }
    }

    if (threateningPos) {
        const threathPos = decode.fromPieceDecl(threateningPos)
        const newAttacks = []
        for (const attack of result.attacks) {
            if (attack.x === threathPos.x && attack.y === threathPos.y) {
                newAttacks.push(attack)
                break
            }
        }
        result.attacks = newAttacks
    }
    return result
}

const createRookResult = (result, rookResults) => {
    if (rookResults) {
        if (rookResults.nextMov) {
            result.nextMovements.push(rookResults.nextMov)
        }

        if (rookResults.attack) {
            result.attacks.push(rookResults.attack)
        }

        if (rookResults.nexMovAfterKing) {
            result.nexMovsAfterKing.push(rookResults.nexMovAfterKing)
        }

        if (rookResults.nextAttackAfterKing) {
            result.nextAttacksAfterKing.push(rookResults.nextAttackAfterKing)
        }
    }

    return result
}

const generateRookPos = (pieces, piece, position, endedDirection, col, row, type) => {
    let shouldCall = false
    if ((position.x === col || position.y === row) && (position.x !== col || position.y !== row)) {

        if (type === 'left' && !endedDirection.left && col < position.x) {
            shouldCall = true
        } else if (type === 'right' && !endedDirection.right && col > position.x) {
            shouldCall = true
        } else if (type === 'top' && !endedDirection.top && row > position.y) {
            shouldCall = true
        } else if (type === 'down' && !endedDirection.down && row < position.y) {
            shouldCall = true
        }

        if (shouldCall) {
            return getAttacktNextMov(pieces, piece, endedDirection, col, row, type)
        }
    }

    return null
}

const getAttacktNextMov = (pieces, piece, endedDirection, col, row, type) => {
    let nextMov = null
    let attack = null
    let nexMovAfterKing = null
    let nextAttackAfterKing = null
    const column = general.getColumn(col)
    const squarePiece = general.findPieceAtPosition(pieces, `${column}${row+1}`)
    if (squarePiece) {
        endedDirection[type] = true
        if (!general.isPiecesFromSameTeam(squarePiece, piece)) {
            attack = {
                x: col,
                y: row
            }
        }
    } else {
        nextMov = {
            x: col,
            y: row
        }
    }

    return {
        nextMov,
        nexMovAfterKing,
        attack,
        nextAttackAfterKing
    }
}

module.exports = {
    getOptions
}