const predictions = require('./predictions')
const general = require('./general')
const decode = require('../decode')

/**
 * Check if the game ended in a checkmate
 * @param {array} pieces all pieces in the table
 * @param {string} turn player playing
 * @param {string} enemyTeam oposite player
 * @param {object} inCheck object with attrs about the king
 */
const isCheckmate = (pieces, turn, enemyTeam, isKingThreatened, threateningPos) => {
    if (isKingThreatened) {
        const teamPieces = general.getPiecesFromTeam(pieces, turn)
        const enemyKing = predictions.getKingPos(pieces, enemyTeam)
        const enemyMovs = []

        for (const piece of teamPieces) {
            const decodedPiece = general.getPieceObject(piece, null, null)
            const nextMovsAtt = predictions.getOptionsByName(pieces, decodedPiece, null, null)

            if (nextMovsAtt.nextMovements) {
                enemyMovs.push({
                    nextMovements: nextMovsAtt.nextMovements,
                    name: piece
                })
            }
        }

        const movs = predictions.getOptionsByName(pieces, enemyKing, enemyMovs)

        if(!movs.nextMovements.length && !movs.attacks.length){
            return true
        }else{
            for(const nextMovs of movs.nextMovements){
                if(!predictions.willTheKingBeThreating(pieces, enemyKing, nextMovs).isKingThreatened){
                    return false
                }
            }
            for(const attack of movs.attacks){
                if(!predictions.willTheKingBeThreating(pieces, enemyKing, attack).isKingThreatened){
                    return false
                }
            }
        }

        return true    
        
    }

    return false
}

/**
 * Check if the game ended in a stalemate
 * @param {array} pieces all pieces in the table
 * @param {string} turn player playing
 * @param {string} enemyTeam oposite player
 * @param {object} inCheck object with attrs about the king 
 */
const isStalemate = (pieces, turn, enemyTeam, isKingThreatened) => {
    if (isKingThreatened) {
        return false
    }

    const enemyNextMovs = predictions.getEnemyNextMovs(pieces, enemyTeam)
    const teamPieces = general.getPiecesFromTeam(pieces, enemyTeam)
    for (const piece of teamPieces) {
        const decodedPiece = decode.fromPieceDecl(piece)
        const result = predictions.getOptionsByName(pieces, decodedPiece, enemyNextMovs)

        if(result.nextMovements.length === 0){
            for(const attack of result.attacks){
                if(!predictions.willTheKingBeThreating(pieces, decodedPiece, attack).isKingThreatened){
                    return false
                }
            }
        }else{
            return false
        }
    }

    return true

}


const getPieceByName = (pieces, name) => {
    for (const piece of pieces) {
        if (piece[0] === name) {
            return piece
        }
    }

    return null
}

/**
 * Check if it still possible any player win with a checkmate
 * @param {array} pieces all pieces in the table
 */
const isimpossibleCheckmate = pieces => {
    if (pieces.length === 2) {
        return true
    } else if (pieces.length === 3 && (getPieceByName(pieces, 'B') || getPieceByName(pieces, 'b'))) {
        return true
    } else if (pieces.length === 3 && (getPieceByName(pieces, 'K') || getPieceByName(pieces, 'k'))) {
        return true
    } else if (pieces.length <= 4 && getPieceByName(pieces, 'B') && getPieceByName(pieces, 'b')) {
        return true
    }

    return false
}

/**
 * Check if the game ended
 * @param {array} pieces all pieces in the table
 * @param {string} turn player playing
 */
const isGameFinished = (pieces, turn, check) => {
    const enemyTeam = turn === 'W' ? 'B' : 'W'
    const inCheck = check ? check : predictions.isEnemyThreateningKing(pieces, enemyTeam)
    let checkmate = false
    let stalemate = false
    let impossibleCheckmate = false

    if (isCheckmate(pieces, turn, enemyTeam, inCheck.isKingThreatened, inCheck.threateningPos)) {
        checkmate = true
    } else if (isStalemate(pieces, turn, enemyTeam, inCheck.isKingThreatened)) {
        stalemate = true
    } else if (isimpossibleCheckmate(pieces)) {
        impossibleCheckmate = true
    }

    return {
        isCheckmate: checkmate,
        isStalemate: stalemate,
        isimpossibleCheckmate: impossibleCheckmate
    }
}

module.exports = {
    isGameFinished
}