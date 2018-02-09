const decode = require('./decode')

const DIRECTION_GOING_UP =  1;
const DIRECTION_GOING_DOWN =  0;
// const COLUMNS = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'}

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

module.exports.isSameTeamPiece = function(draggingPiece, dragToPos){
    const positionedPiece = this.findPieceAtPosition(this.props.pieces, dragToPos)
  return positionedPiece && this.isPiecesFromSameTeam(draggingPiece, positionedPiece)
}

module.exports.showPawnOptions = function(piece){
    const direction = piece.name === piece.name.toUpperCase() ? DIRECTION_GOING_UP : DIRECTION_GOING_DOWN
    const positionInc = direction ? +1 : -1
    const oldPostition = parseInt(piece.position[1], 0)
    const newPosition = piece.position[0] + (oldPostition + positionInc)

    console.log('new position', piece.position[0] + (oldPostition + positionInc), oldPostition + positionInc);
    // const {x, y, piece} = decode.fromPieceDecl(decl)
}