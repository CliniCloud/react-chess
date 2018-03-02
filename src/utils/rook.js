const general = require('./general')
const decode = require('../decode')

module.exports.getOptions = function(pieces, piece, threateningPos){
    const position = decode.fromPieceDecl(piece.notation)
    let nextMovements = []
    let attacks = []
    let endedDirection = {left:false, right:false, top:false, down:false}

    for (let col = position.x; col > -1; col--) {
        for (let row = 0; row < 8; row++) {
            const result = generateRookPos(pieces, piece, position, endedDirection, col, row, 'left')
            createRookResult(nextMovements, attacks, result)
        }
    }

    for (let col = position.x; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            const result = generateRookPos(pieces, piece, position, endedDirection, col, row, 'right')
            createRookResult(nextMovements, attacks, result)
        }
    }


    for (let col = 0; col < 8; col++) {
        for (let row = position.y; row > 0; row--) {
            const result = generateRookPos(pieces, piece, position, endedDirection, col, row, 'down')
            createRookResult(nextMovements, attacks, result)
        }
    }

    for (let col = 0; col < 8; col++) {
        for (let row = position.y; row < 8; row++) {
            const result = generateRookPos(pieces, piece, position, endedDirection, col, row, 'top')
            createRookResult(nextMovements, attacks, result)
        }
    }
    
    if(threateningPos){
        const threathPos = decode.fromPieceDecl(threateningPos)
        nextMovements = []
        const newAttacks = []
        for(const attack of attacks){
            if(attack.x === threathPos.x && attack.y === threathPos.y){
                newAttacks.push(attack)
                break 
            }
        }
        attacks = newAttacks
    }

    return {nextMovements,attacks}
}


function generateRookPos(pieces, piece, position, endedDirection, col, row, type){
    var nextMov = null
    var attack = null
    if((position.x === col || position.y === row) && (position.x !== col || position.y !== row)){
        if((type === 'left' && !endedDirection.left && col < position.x) || (type === 'right' && !endedDirection.right && col > position.x) ||
        (type === 'top' && !endedDirection.top && row > position.y) || (type === 'down' && !endedDirection.down && row < position.y)){
            const column = general.getColumn(col)
            const squarePiece = general.findPieceAtPosition(pieces, `${column}${row+1}`)
            if(squarePiece){
                endedDirection = Object.assign(endedDirection, compareRookFoundPiece(position, {x:col, y:row}))
                if(!general.isPiecesFromSameTeam(squarePiece, piece)){
                    attack = {x:col, y:row}
                }
            }else{
                nextMov = {x:col, y:row}
            }
        }
    }

    return {nextMov, attack}
}

function createRookResult(nextMovements, attacks, result){
    if(result.nextMov){
        nextMovements.push(result.nextMov)
    }
    if(result.attack){
        attacks.push(result.attack)
    }

    return {nextMovements, attacks}
}

function compareRookFoundPiece(rookPosition, foundPiecePosition){
    if(foundPiecePosition.x > rookPosition.x){
        return {right : true}
    }else if(foundPiecePosition.x < rookPosition.x){
        return {left : true}
    }else if(foundPiecePosition.y > rookPosition.y){
        return {top : true}
    }else if(foundPiecePosition.y < rookPosition.y){
        return {down : true}
    }
}