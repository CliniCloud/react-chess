const DIRECTION_GOING_UP =  1;
const DIRECTION_GOING_DOWN =  0;

module.exports.isPiecesFromSameTeam = function(pieceA, pieceB){
    return (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) || 
    (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())
}

module.exports.showPawnOptions = function(piece){
    const direction = piece.name === piece.name.toUpperCase() ? DIRECTION_GOING_UP : DIRECTION_GOING_DOWN
    const positionInc = direction ? +1 : -1

    
    
}