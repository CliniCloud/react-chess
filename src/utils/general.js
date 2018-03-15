const decode = require('../decode')

const isPieceTurn = (pieceName, turn) => (pieceName === pieceName.toUpperCase() && turn === 'W') || (pieceName === pieceName.toLowerCase() && turn === 'B')

const hasPawnPieceChange = (pieceName, position) => pieceName.toLowerCase() === 'p' && ((pieceName === pieceName.toUpperCase() && position.y === 0) || (pieceName === pieceName.toLowerCase() && position.y === 7))

const whatIsMyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'W' : 'B'

const whatIsEnemyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'B' : 'W'

const isValidRange = range => range >= 0 && range <= 7

const getColumn = code => isValidRange(code) ? String.fromCharCode(decode.charCodeOffset + code) : null

const isPiecesFromSameTeam = (pieceA, pieceB) => (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) || (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())

const getPieceObject = (piece, index, position) =>  Object.assign({},decode.fromPieceDecl(piece), { notation: piece, name: piece.slice(0, 1), index, position: position ? position : piece.substr(piece.indexOf('@') + 1) })

const findPieceAtPosition = (pieces, pos) => {
    const newPos = pos.length > 2 ? pos.substr(pos.indexOf('@') + 1) : pos

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i]
        if (piece.indexOf(newPos) ===  piece.indexOf('@') + 1) {
            return getPieceObject(piece, i, newPos)
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
            return mov
        }
    }

    for (const attack of attacks) {
        if (attack.x === piece.x && attack.y === y) {
            return attack
        }
    }

    return null
}

const getPiecesFromTeam = (pieces, team) => {
    return pieces.map(item => {
        if (team.toUpperCase() === 'W' && item[0].toUpperCase() === item[0]) {
            return item
        } else if (team.toUpperCase() === 'B' && item[0].toLowerCase() === item[0]) {
            return item
        }
        
        return null
    }).filter(Boolean)
}

module.exports = {
    isPieceTurn,
    hasPawnPieceChange,
    whatIsMyTeam,
    whatIsEnemyTeam,
    isValidRange,
    getColumn,
    isPiecesFromSameTeam,
    getPieceObject,
    findPieceAtPosition,
    isSameTeamPiece,
    isValidMovement,
    getPiecesFromTeam
}