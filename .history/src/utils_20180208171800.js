const decode = require('./decode')

const DIRECTION_GOING_UP =  1;
const DIRECTION_GOING_DOWN =  0;

module.exports.isPiecesFromSameTeam = function(pieceA, pieceB){
    return (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) || 
    (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())
}

module.exports.findPieceAtPosition = function(pieces, pos) {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i]
      if (piece.indexOf(pos) === 2) {
        return {notation: piece, name: piece.slice(0, 1), index: i, position: pos}
      }
    }

    return null
  }

module.exports.isSameTeamPiece = function(pieces, draggingPiece, dragToPos){
    const positionedPiece = this.findPieceAtPosition(pieces, dragToPos)
  return positionedPiece && this.isPiecesFromSameTeam(draggingPiece, positionedPiece)
}

module.exports.getColumn = function(code){
    if(code < 0 || code > 7){
        return null
    }

    return String.fromCharCode(decode.charCodeOffset + code)
}

module.exports.getPawnOptions = function(pieces, piece){
    const direction = piece.name === piece.name.toUpperCase() ? DIRECTION_GOING_UP : DIRECTION_GOING_DOWN
    const positionInc = direction ? +1 : -1
    const oldPostition = parseInt(piece.position[1], 0)
    const frontPosition = piece.position[0] + (oldPostition + positionInc)

    console.log('new position', `${piece.name}@${frontPosition}`);
    const piecePositions = decode.fromPieceDecl(`${piece.name}@${frontPosition}`)
    console.log('old position', piecePositions);
    // var newX = piecePositions.x + positionInc
    
    let newAttack = this.getPawAttack(pieces,piecePositions, piecePositions.x - 1)
    console.log('DEICCCCCCCCCo', newAttack);

    const attacsOpt = [this.getColumn(piecePositions.x - 1),this.getColumn(piecePositions.x + 1)]
    const movements = [this.getColumn(piecePositions.x)]

    console.log('QQQQQQQQQQQQQQQQ', {movements, attacsOpt});
    return {movements, attacsOpt}
}

module.exports.getPawAttack = function(pieces, newPiecePos, newX){
    const newColumn = this.getColumn(newX)
    if(newColumn){
        const square = `${newColumn}${newPiecePos.y }`
        const newObj = Object.assign( newPiecePos,{x:newX, square})
        this.hasEnemyOnSquare(pieces, newObj)
        return newObj
    }
    return null
}

module.exports.hasEnemyOnSquare = function(pieces, piecePosition){
    const positionInSquare = this.findPieceAtPosition(pieces, piecePosition.square)
    console.log('positionInSquare', positionInSquare, piecePosition.square);
}