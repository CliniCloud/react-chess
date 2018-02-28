const general = require('./general')
const decode = require('../decode')

module.exports.getOptions = function(pieces, piece, isFirstMovemnt) {
    const position = decode.fromPieceDecl(piece.notation)
    const nextMovements = []
    const attacks = []
    const lengthRows = position.qntPlayed === 0 ? 2 : 1 //first time pawn may move two spaces
    const row = piece.name === piece.name.toLowerCase() ? position.y - 1 : position.y + 1 //row will change depending wich team

    for (let colIndex = -1; colIndex < 2; colIndex++) {
        const column = general.getColumn(position.x - colIndex)
        if (column) {
            const squarePiece = general.findPieceAtPosition(pieces, `${column}${row +1}`)
            if (colIndex === 0 && squarePiece === null) {
                for (let rowIndex = 0; rowIndex < lengthRows; rowIndex++) {
                    nextMovements.push({
                        x: position.x - colIndex,
                        y: piece.name === piece.name.toLowerCase() ? row - rowIndex : row + rowIndex
                    })
                }
            } else if (colIndex !== 0) {
                if (squarePiece) {
                    if (!general.isPiecesFromSameTeam(squarePiece, piece, row)) {
                        attacks.push({
                            x: position.x - colIndex,
                            y: row
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