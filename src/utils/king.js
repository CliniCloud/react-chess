const general = require('./general')
const decode = require('../decode')
const pawn = require('./pawn')

const getOptions = (pieces, piece, enemyPossibleMov) => {
    const position = decode.fromPieceDecl(piece.notation)
    let nextMovements = []
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

    //remove from all possible enemy movements and enemy pawn attacks from king movements
    if(enemyPossibleMov && enemyPossibleMov.length){
        const nextMovsWoEnemyMovs = nextMovements
        for(const index in nextMovements){
            const nextMom = nextMovements[index]

            for(const enemy of enemyPossibleMov){
                const name = enemy.name.toUpperCase()
                for(const enemyMov of enemy.nextMovements){
                    if(name !== 'P' &&  enemyMov.x === nextMom.x && enemyMov.y === nextMom.y ){
                        nextMovsWoEnemyMovs.splice(index,1);
                    }
                }
            }

            for(const pawnAttack of pawn.getEnemyPawnsAttacks(pieces, general.whatIsEnemyTeam(position.piece))){
                if(pawnAttack.x === nextMom.x && pawnAttack.y === nextMom.y){
                    nextMovsWoEnemyMovs.splice(index,1);
                }
            }
        }

        nextMovements = nextMovsWoEnemyMovs
    }

    return {
        nextMovements,
        attacks
    }
}

module.exports = {
    getOptions
}