const predictions = require('./predictions')
const general = require('./general')
const decode = require('../decode')

/**
 * Check if the game ended in a chequemate
 * @param {array} pieces all pieces in the table
 * @param {string} turn player playing
 * @param {string} enemyTeam oposite player
 * @param {object} inCheck object with attrs about the king
 */
const isChequemate = (pieces, turn, enemyTeam, inCheck) => {
    let chequemate = true
    if (inCheck.isKingThreatened) {
        const teamPieces = general.getPiecesFromTeam(pieces, enemyTeam)
        for (const piece of teamPieces) {
            const decodedPiece = general.getPieceObject(piece, null, null)
            const nextMovsAtt = predictions.getOptionsByName(pieces, decodedPiece, null, inCheck.threateningPos)

            if (nextMovsAtt.nextMovements) {
                for (const mov of nextMovsAtt.nextMovements) {
                    if (!predictions.willTheKingBeThreating(pieces, decodedPiece, mov).isKingThreatened) {
                        chequemate = false
                        break;
                    }
                }
            }
            if (nextMovsAtt.attacks && chequemate) {
                for (const attack of nextMovsAtt.attacks) {
                    if (!predictions.willTheKingBeThreating(pieces, decodedPiece, attack).isKingThreatened) {
                        chequemate = false
                        break;
                    }
                }
            }
            if (!chequemate) {
                break;
            }
        }
        return chequemate
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
const isStalemate = (pieces, turn, enemyTeam, inCheck) => {
    if (inCheck.isKingThreatened) {
        return false
    }

    const enemyNextMovs = predictions.getEnemyNextMovs(pieces, enemyTeam)
    const teamPieces = general.getPiecesFromTeam(pieces, enemyTeam)
    for (const piece of teamPieces) {
        const result = predictions.getOptionsByName(pieces, decode.fromPieceDecl(piece), enemyNextMovs)
        if (result.nextMovements.length > 0 || result.attacks.length > 0) {
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
 * Check if it still possible any player win with a chequemate
 * @param {array} pieces all pieces in the table
 */
const isImpossibleChequemate = pieces => {
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
const isGameFinished = (pieces, turn) => {
    const enemyTeam = turn === 'W' ? 'B' : 'W'
    const inCheck = predictions.isEnemyThreateningKing(pieces, enemyTeam)
    let chequemate = false
    let stalemate = false
    let impossibleChequemate = false

    if (isChequemate(pieces, turn, enemyTeam, inCheck)) {
        chequemate = true
    } else if (isStalemate(pieces, turn, enemyTeam, inCheck)) {
        stalemate = true
    } else if (isImpossibleChequemate(pieces)) {
        impossibleChequemate = true
    }

    return {
        isChequemate: chequemate,
        isStalemate: stalemate,
        isImpossibleChequemate: impossibleChequemate
    }
}

module.exports = {
    isGameFinished
}