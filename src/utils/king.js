const general = require('./general')
const decode = require('../decode')
const pawn = require('./pawn')

const getOptions = (pieces, piece, enemyPossibleMov) => {
    const position = piece.x ? piece : decode.fromPieceDecl(piece.notation)
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

    //castling
    if (!position.qntPlayed) {
        const rookY = position.y + 1
        const leftRook = general.findPieceAtPosition(pieces, `a${rookY}`)
        const rightRook = general.findPieceAtPosition(pieces, `h${rookY}`)

        if (leftRook && leftRook.name.toUpperCase() === 'R' && leftRook.qntPlayed === 0) {
            if (!general.findPieceAtPosition(pieces, `b${rookY}`) && !general.findPieceAtPosition(pieces, `c${rookY}`) && !general.findPieceAtPosition(pieces, `d${rookY}`)) {
                leftRook.nextPos = `d${rookY}`
                nextMovements.push({
                    x: 2,
                    y: position.y,
                    rookPos: leftRook
                })
            }
        }
        
        if (rightRook && rightRook.name.toUpperCase() === 'R' && rightRook.qntPlayed === 0) {
            if (!general.findPieceAtPosition(pieces, `f${rookY}`) && !general.findPieceAtPosition(pieces, `g${rookY}`)) {
                rightRook.nextPos = `f${rookY}`
                nextMovements.push({
                    x: 6,
                    y: position.y,
                    rookPos: rightRook
                })
            }
        }
    }

    //remove from all possible enemy movements and enemy pawn attacks from king movements
    if (enemyPossibleMov && enemyPossibleMov.length) {
        mainLoop:
        for(let index = nextMovements.length -1; index >= 0; index --){
            const nextMom = nextMovements[index]
            enemyLoop:
            for(const enemy of enemyPossibleMov){
                const name = enemy.name.toUpperCase()
                for (const enemyMov of enemy.nextMovements) {
                    if (name !== 'P' && enemyMov.x === nextMom.x && enemyMov.y === nextMom.y) {
                        nextMovements.splice(index, 1);
                        if (!nextMovements.length) {
                            break mainLoop
                        }
                        break enemyLoop;
                    }
                }
            }

            for (const pawnAttack of pawn.getEnemyPawnsAttacks(pieces, general.whatIsEnemyTeam(position.piece))) {
                if (pawnAttack.x === nextMom.x && pawnAttack.y === nextMom.y) {
                    nextMovements.splice(index, 1);
                    if (!nextMovements.length) {
                        break mainLoop
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

module.exports = {
    getOptions
}