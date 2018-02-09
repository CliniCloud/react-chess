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

    const piecePositions2 = decode.fromPieceDecl(piece.notation)
    console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTT', piecePositions2);
    console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTT', piece);
    const nextMovPositions = this.createNewPieceByNotation(pieces, `${piece.name}@${frontPosition}`, piece.index)
    console.log('old position', nextMovPositions);
    // var newX = piecePositions.x + positionInc


    // nextMovPositions.x--
    // let newLeftAttack = this.getPawAttack(pieces,nextMovPositions )
    // console.log('----------------LEFT newAttack ----------', newLeftAttack);
    // nextMovPositions.x = nextMovPositions.x + 2
    // let newRightAttack = this.getPawAttack(pieces,nextMovPositions )
    // console.log('----------------RIGHT newAttack ----------', newRightAttack);


    
    // const attacsOpt = [this.getColumn(piecePositions.x - 1),this.getColumn(piecePositions.x + 1)]
    // const movements = [this.getColumn(piecePositions.x)]

// console.log('QQQQQQQQQQQQQQQQ', {movements, attacsOpt});
// return {movements, attacsOpt}
}

module.exports.getPawAttack = function(pieces, newPiecePos) {
    console.log('------------newPiecePos', newPiecePos);
    const newColumn = this.getColumn(newPiecePos.x)
    if (newColumn) {
        const square = `${newColumn}${newPiecePos.y }`
        const newObj = Object.assign(newPiecePos, {
            square
        })
        // this.hasEnemyOnSquare(pieces, newObj)
        return newObj
    }
    return null
}

module.exports.hasEnemyOnSquare = function(pieces, position) {
    const positionInSquare = this.findPieceAtPosition(pieces, position)
    console.log('positionInSquare', positionInSquare, position);
}

module.exports.createNewPieceByNotation = function(pieces, notation, index) {
    const str = notation.split('@')
    const result = Object.assign(decode.fromPieceDecl(notation), {
        notation,
        name: str[0],
        index,
        position: str[1]
    })

    console.log('HAS ENEMY', this.hasEnemyOnSquare(pieces,str[1]));

    return result
}

module.exports.createNewPiece = function(name, index, position) {
    return {
        notation: `${name}@${position}`,
        name,
        index,
        position
    }
}