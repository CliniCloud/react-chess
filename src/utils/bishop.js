const general = require('./general')
const decode = require('../decode')


const getAttacktNextMov = (pieces, piece, endedDirection,  col, row, type) => {
    const column = general.getColumn(col)
    let attack = null
    let nextMov = null
    let newEndedDirection
    if (column) {
        const squarePiece = general.findPieceAtPosition(pieces, `${column}${row+1}`)
        if (squarePiece) {
            newEndedDirection = Object.assign(endedDirection, {[type]:true})
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

    return {
        nextMov,
        attack,
        endedDirection: newEndedDirection ? newEndedDirection : endedDirection
    }
}

const generateBishopPos = (pieces, piece, position, endedDirection, index, type) => {
    let shouldCall = false
    const col = type === 'topLeft' ? position.x - index : position.x + index
    const row = type === 'downRight' ? position.y - index : position.y + index
    if ((position.x !== col || position.y !== row) && row >= 0 && row < 8) {

        if(type === 'topLeft' && !endedDirection.topLeft && col < position.x && row > position.y){
            shouldCall = true
        }else if(type === 'downRight' && !endedDirection.downRight && col > position.x && row < position.y){
            shouldCall = true
        }else if(type === 'topRight' && !endedDirection.topRight && row > position.y && col > position.x){
            shouldCall = true
        }else if(type === 'downLeft' && !endedDirection.downLeft && row < position.y && col < position.x){
            shouldCall = true
        }

        if(shouldCall){
            return getAttacktNextMov(pieces, piece, endedDirection, col, row, type)
        }
    }

    return null
}

const createBishopResult = (nextMovements, attacks, result) => {
    if(result){
        if (result.nextMov) {
            nextMovements.push(result.nextMov)
        }
        if (result.attack) {
            attacks.push(result.attack)
        }
    }

    return {
        nextMovements,
        attacks
    }
}

const getOptions = (pieces, piece, threateningPos) => {
    const position = piece.x ? piece : decode.fromPieceDecl(piece.notation)
    const nextMovements = []
    let attacks = []
    let endedDirection = {
        topLeft: false,
        topRight: false,
        downRight: false,
        downLeft: false
    }

    for (let i = 0; i < 8; i++) {
        const topRight = generateBishopPos(pieces, piece, position, endedDirection, i, 'topRight')
        endedDirection = topRight ? topRight.endedDirection : endedDirection
        createBishopResult(nextMovements, attacks, topRight)

        const downLeft = generateBishopPos(pieces, piece, position, endedDirection, i * -1, 'downLeft')
        endedDirection = downLeft ? downLeft.endedDirection : endedDirection
        createBishopResult(nextMovements, attacks, downLeft)

        const topLeft = generateBishopPos(pieces, piece, position, endedDirection, i, 'topLeft')
        endedDirection = topLeft ? topLeft.endedDirection : endedDirection
        createBishopResult(nextMovements, attacks, topLeft)

        const downRight = generateBishopPos(pieces, piece, position, endedDirection, i, 'downRight')
        endedDirection = downRight ? downRight.endedDirection : endedDirection
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

module.exports = {
    getOptions
}