const bishop = require('./bishop')
const rook = require('./rook')

module.exports.getOptions = function(pieces, piece, threateningPos){
    let nextMovements = []
    let attacks = []

    const bishopResult = bishop.getOptions(pieces, piece, threateningPos)
    nextMovements = nextMovements.concat(bishopResult.nextMovements)
    attacks = attacks.concat(bishopResult.attacks)

    const rookResult = rook.getOptions(pieces, piece, threateningPos)
    nextMovements = nextMovements.concat(rookResult.nextMovements)
    attacks = attacks.concat(rookResult.attacks)

    return {
        nextMovements,
        attacks
    }
}
