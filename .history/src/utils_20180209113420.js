const decode = require('./decode')

const DIRECTION_GOING_UP = 1;
const DIRECTION_GOING_DOWN = 0;

module.exports.isPiecesFromSameTeam = function(pieceA, pieceB) {
    return (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) ||
        (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())
}

module.exports.findPieceAtPosition = function(pieces, pos) {
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i]
        if (piece.indexOf(pos) === 2) {
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

module.exports.getColumn = function(code) {
    if (code < 0 || code > 7) {
        return null
    }

    return String.fromCharCode(decode.charCodeOffset + code)
}

module.exports.getPawnOptions = function(pieces, piece) {
    const direction = piece.name === piece.name.toUpperCase() ? DIRECTION_GOING_UP : DIRECTION_GOING_DOWN
    const positionInc = direction ? +1 : -1
    const oldPostition = parseInt(piece.position[1], 0)
    const frontPosition = piece.position[0] + (oldPostition + positionInc)

    const pieceNextMov = this.createNewPieceByNotation(pieces, `${piece.name}@${frontPosition}`, piece.index)
    console.log('old position', pieceNextMov);


    const leftAttack = this.getPawAttack(pieces, pieceNextMov, +1 )
    console.log('----------------LEFT newAttack ----------', leftAttack);
    const rightAttack = this.getPawAttack(pieces,pieceNextMov , -1)
    console.log('----------------RIGHT newAttack ----------', rightAttack);

    return { pieceNextMov, attacks:[ leftAttack, rightAttack ]}

}

module.exports.getPawAttack = function(pieces, piece, positionInc) {
    const newColumn = this.getColumn(piece.x + positionInc)
    if (newColumn) {
        console.log('NEW COLUMN', newColumn, `${piece.name}@${newColumn}${piece.y + 1}`);
        const newObj = this.createNewPieceByNotation(pieces,`${piece.name}@${newColumn}${piece.y + 1}`,piece.index)
        return newObj
    }
    return null
}

module.exports.createNewPieceByNotation = function(pieces, notation, index) {
    const str = notation.split('@')
    const hasEnemyResult = this.hasEnemyOnSquare(pieces,str[1], str[0])
    const result = Object.assign(decode.fromPieceDecl(notation), {
        notation,
        name: str[0],
        index,
        position: str[1],
        hasAnotherPiece: typeof hasEnemyResult === 'boolean',
        isEnemy: hasEnemyResult

    })

    return result
}

module.exports.hasEnemyOnSquare = function(pieces, position, name) {
    const positionInSquare = this.findPieceAtPosition(pieces, position)
    return positionInSquare && positionInSquare.name !== name
}

module.exports.createNewPiece = function(name, index, position) {
    return {
        notation: `${name}@${position}`,
        name,
        index,
        position
    }
}