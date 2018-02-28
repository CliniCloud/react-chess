const general = require('./general')
const decode = require('../decode')

module.exports.getOptions = function(pieces, piece) {
    const position = decode.fromPieceDecl(piece.notation)
    const nextMovements = []
    const attacks = []

    for (let col = -1; col < 2; col++) {
        for (let row = -1; row < 2; row++) {
            const newX = position.x - col
            const column = general.getColumn(newX)
            if (column) {
                const newY = position.y - row
                if (general.isValidRange(newY)) {
                    const squarePiece = general.findPieceAtPosition(pieces, `${column}${newY+1}`)
                    if (squarePiece) {
                        if (!general.isPiecesFromSameTeam(squarePiece, piece)) {
                            attacks.push({
                                x: newX,
                                y: newY
                            })
                        }
                    } else {
                        nextMovements.push({
                            x: newX,
                            y: newY
                        })
                    }
                }
            }
        }

    }

    return {
        nextMovements,
        attacks
    }
}