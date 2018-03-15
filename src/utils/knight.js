const general = require('./general')
const decode = require('../decode')

const isRangeMatch = (range, x, y) => {
    for(const item of range){
        if(item.x === x && item.y === y){
            return true
        }
    }

    return false
}

const getOptions = function(pieces, piece, threateningPos) {
    const position = piece.x ? piece : decode.fromPieceDecl(piece.notation)
    const allowedMovements = [{x:1,y:2}, {x:-1,y:2}, {x:2,y:1}, {x:-2,y:1}, {x:2,y:-1}, {x:-2,y:-1}, {x:1,y:-2}, {x:-1,y:-2}]
    const nextMovements = []
    let attacks = []

    for (let col = -2; col < 3; col++) {
        const newX = position.x - col
        const column = general.getColumn(newX)
        if(column){
            for (let row = -2; row < 3; row++) {
                const newY = position.y - row
                if(general.isValidRange(newY)){
                    if(isRangeMatch(allowedMovements, newX - position.x, newY - position.y)){
                        const squarePiece = general.findPieceAtPosition(pieces, `${column}${newY+1}`)
                        if(squarePiece){
                            if(!general.isPiecesFromSameTeam(squarePiece, piece)){
                                attacks.push({x:newX, y:newY})
                            }
                        }else{
                            nextMovements.push({x:newX, y:newY})
                        }
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

    return {nextMovements, attacks}
}

module.exports = {
    getOptions
}