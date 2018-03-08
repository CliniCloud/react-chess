const general = require('./general')
const decode = require('../decode')

 const getOptions = function(pieces, piece, threateningPos) {
    const position = decode.fromPieceDecl(piece.notation)
    let nextMovements = []
    let attacks = []
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

    if(threateningPos){
        const threathPos = decode.fromPieceDecl(threateningPos)
        const newAttacks = []
        for(const attack of attacks){
            if(attack.x === threathPos.x && attack.y === threathPos.y){
                newAttacks.push(attack)
                break 
            }
        }
        attacks = newAttacks
    }

    return {
        nextMovements,
        attacks
    }

}

const getEnemyPawnsAttacks = (pieces, enemyTeam) => {
    const attackerPositions = []
    for (const piece of pieces) {
        let piecePos, rowIndex
        const enemyName = piece[0].toUpperCase()
        
        if(enemyName === 'P'){
            if (enemyTeam === 'W' && piece[0] === enemyName) {
                piecePos = piece
                rowIndex = +1
            } else if (enemyTeam === 'B' && piece[0] === piece[0].toLowerCase()) {
                piecePos = piece
                rowIndex = -1
            }
    
            if (piecePos) {
                const attacker = decode.fromPieceDecl(piecePos)
                attackerPositions.push(Object.assign({}, attacker, {x:attacker.x + 1 , y:  attacker.y + rowIndex }))
                attackerPositions.push(Object.assign({}, attacker, {x:attacker.x - 1 , y:  attacker.y + rowIndex}))
            }
        }
    }

    return attackerPositions
}

module.exports = {
    getOptions,
    getEnemyPawnsAttacks
}