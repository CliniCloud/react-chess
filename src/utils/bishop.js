const general = require('./general')

const decode = require('../decode')

const getOptions = (pieces, piece, threateningPos) => {
    const position = decode.fromPieceDecl(piece.notation)
    let nextMovements = []
    let attacks = []
    let endedDirection = {
        topLeft: false,
        topRight: false,
        downRight: false,
        downLeft: false
    }

    for (let i = 0; i < 8; i++) {
        const topRight = generateBishopPos(pieces, piece, position, endedDirection, i, 'topRight')
        createBishopResult(nextMovements, attacks, topRight)

        const downLeft = generateBishopPos(pieces, piece, position, endedDirection, i * -1, 'downLeft')
        createBishopResult(nextMovements, attacks, downLeft)

        const topLeft = generateBishopPos(pieces, piece, position, endedDirection, i, 'topLeft')
        createBishopResult(nextMovements, attacks, topLeft)

        const downRight = generateBishopPos(pieces, piece, position, endedDirection, i, 'downRight')
        createBishopResult(nextMovements, attacks, downRight)
    }


    if (threateningPos) {
        const threathPos = decode.fromPieceDecl(threateningPos)
        const newAttacks = []
        for (const attack of attacks) {
            if (attack.x === threathPos.x && attack.y === threathPos.y) {
                newAttacks.push(attack)
                break
            }
        }
        attacks = newAttacks
    }

    return {
        nextMovements,
        attacks
    }
}

const generateBishopPos = (pieces, piece, position, endedDirection, index, type) => {
    let nextMov = null
    let attack = null
    const col = type === 'topLeft' ? position.x - index : position.x + index
    const row = type === 'downRight' ? position.y - index : position.y + index
    if ((position.x !== col || position.y !== row) && row > 0 && row < 8) {
        if ((type === 'topLeft' && !endedDirection.topLeft && col < position.x && row > position.y) || (type === 'downRight' && !endedDirection.downRight && col > position.x && row < position.y) ||
            (type === 'topRight' && !endedDirection.topRight && row > position.y && col > position.x) || (type === 'downLeft' && !endedDirection.downLeft && row < position.y && col < position.x)) {
            const column = general.getColumn(col)
            if (column) {
                const squarePiece = general.findPieceAtPosition(pieces, `${column}${row+1}`)
                if (squarePiece) {
                    endedDirection = Object.assign(endedDirection, compareBishopFoundPiece(type))
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
            }
        }
    }

    return {
        nextMov,
        attack
    }
}

const compareBishopFoundPiece = type => {
    const result = {}
    result[type] = true
    return result
}

const createBishopResult = (nextMovements, attacks, result) => {
    if (result.nextMov) {
        nextMovements.push(result.nextMov)
    }
    if (result.attack) {
        attacks.push(result.attack)
    }

    return {
        nextMovements,
        attacks
    }
}

module.exports = {
    getOptions
}