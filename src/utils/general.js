const decode = require('../decode')

const isPieceTurn = (pieceName, turn) => (pieceName === pieceName.toUpperCase() && turn === 'W') || (pieceName === pieceName.toLowerCase() && turn === 'B')

const hasPawnPieceChange = (pieceName, position) => pieceName.toLowerCase() === 'p' && ((pieceName === pieceName.toUpperCase() && position.y === 0) || (pieceName === pieceName.toLowerCase() && position.y === 7))

const whatIsMyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'W' : 'B'

const whatIsEnemyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'B' : 'W'

const isValidRange = range => range >= 0 && range <= 7

const getColumn = code => !isValidRange(code) ? null : String.fromCharCode(decode.charCodeOffset + code)

const isPiecesFromSameTeam = (pieceA, pieceB) => (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) || (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())

const findPieceAtPosition = (pieces, pos) => {
    const newPos = pos.length > 2 ? pos.substr(pos.indexOf('@') + 1) : pos

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i]
        if (piece.indexOf(newPos) ===  piece.indexOf('@') + 1) {
            return {
                notation: piece,
                name: piece.slice(0, 1),
                index: i,
                position: newPos
            }
        }
    }

    return null
}

const isSameTeamPiece = (pieces, draggingPiece, dragToPos) => {
    const positionedPiece = findPieceAtPosition(pieces, dragToPos)
    return positionedPiece && isPiecesFromSameTeam(draggingPiece, positionedPiece)
}

const isValidMovement = (nextPossMov, attacks, piece) => {
    const y = 7 - piece.y
    for (const mov of nextPossMov) {
        if (mov.x === piece.x && mov.y === y) {
            return true
        }
    }

    for (const attack of attacks) {
        if (attack.x === piece.x && attack.y === y) {
            return true
        }
    }

    return false
}

const getPiecesFromTeam = (pieces, team) => {
    return pieces.map(item => {
        if (team.toUpperCase() === 'W' && item[0].toUpperCase() === item[0]) {
            return item
        } else if (team.toUpperCase() === 'B' && item[0].toLowerCase() === item[0]) {
            return item
        } else {
            return null
        }
    }).filter(Boolean)
}



module.exports = {
    isPiecesFromSameTeam,
    findPieceAtPosition,
    isSameTeamPiece,
    isValidRange,
    getColumn,
    isValidMovement,
    isPieceTurn,
    hasPawnPieceChange,
    whatIsMyTeam,
    whatIsEnemyTeam,
    getPiecesFromTeam
}