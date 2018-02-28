const decode = require('../decode')

module.exports.isPiecesFromSameTeam = function(pieceA, pieceB) {
    return (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) ||
        (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())
}

module.exports.findPieceAtPosition = function(pieces, pos) {
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i]
        if (piece.indexOf(pos) === 4) {
            return {
                notation: piece,
                name: piece.slice(0, 1),
                index: i,
                position: pos
            }
        }
    }

    return null
}

module.exports.isSameTeamPiece = function(pieces, draggingPiece, dragToPos) {
    const positionedPiece = this.findPieceAtPosition(pieces, dragToPos)
    return positionedPiece && this.isPiecesFromSameTeam(draggingPiece, positionedPiece)
}

module.exports.isValidRange = function(range) {
    return range >= 0 && range <= 7
}

module.exports.getColumn = function(code) {
    if (!this.isValidRange(code)) {
        return null
    }

    return String.fromCharCode(decode.charCodeOffset + code)
}

module.exports.isValidMovement = function(nextPossMov, attacks, piece) {
    const y = 7 - piece.y
    for (let mov of nextPossMov) {
        if (mov.x === piece.x && mov.y === y) {
            return true
        }
    }

    for (let attack of attacks) {
        if (attack.x === piece.x && attack.y === y) {
            return true
        }
    }

    return false
}

module.exports.isPieceTurn = function(pieceName, turn) {
    return (pieceName === pieceName.toUpperCase() && turn === 'W') || (pieceName === pieceName.toLowerCase() && turn === 'B')
}

module.exports.hasPawnPieceChange = function (pieceName, position){
    return pieceName.toLowerCase() === 'p' && ((pieceName === pieceName.toUpperCase() && position.y === 0) || (pieceName === pieceName.toLowerCase() && position.y === 7))
}