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

module.exports.getPawnOptions = function(piece){
    const direction = piece.name === piece.name.toUpperCase() ? DIRECTION_GOING_UP : DIRECTION_GOING_DOWN
    const positionInc = direction ? +1 : -1
    const oldPostition = parseInt(piece.position[1], 0)
    const frontPosition = piece.position[0] + (oldPostition + positionInc)

    console.log('new position', `${piece.name}@${frontPosition}`);
    const piecePositions = decode.fromPieceDecl(`${piece.name}@${frontPosition}`)
    // var newX = piecePositions.x + positionInc
    

    var x = piecePositions.x 
    var column = this.getColumn(x)
    if(column){
        // var y = piecePositions.y
        let square = `${column}@${piecePositions.y}`
        console.log('COLUMN ', column, square);
    }

    console.log('DEICCCCCCCCCo', piecePositions);

    const attacsOpt = [this.getColumn(piecePositions.x - 1),this.getColumn(piecePositions.x + 1)]
    const movements = [this.getColumn(piecePositions.x)]

    console.log('QQQQQQQQQQQQQQQQ', {movements, attacsOpt});
    return {movements, attacsOpt}
    
}