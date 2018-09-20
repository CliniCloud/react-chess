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
const isCheckmate = (pieces, turn, enemyTeam) => {
    const teamPieces = general.getPiecesFromTeam(pieces, turn)
    const enemyKing = predictions.getKingPos(pieces, enemyTeam)
    const teamMovs = teamPieces.map(piece => {
        const decodedPiece = general.getPieceObject(piece, null, null)
        const nextMovsAtt = predictions.getOptionsByName(pieces, decodedPiece, null, null)
        if (nextMovsAtt.nextMovements && nextMovsAtt.nextMovements.length) {
            return {
                nextMovements: nextMovsAtt.nextMovements,
                name: piece
            }
        }
        return false
    }).filter(Boolean)
    
    const enemyKingMovs = predictions.getOptionsByName(pieces, enemyKing, teamMovs)
    const noThreatenedMov = enemyKingMovs.nextMovements.find(nextMovs => predictions.willTheKingBeThreating(pieces, enemyKing, nextMovs).isKingThreatened === false)
    if (noThreatenedMov) {
        return false
    }

    const noThreatenedAttack = enemyKingMovs.attacks.find(attack => predictions.willTheKingBeThreating(pieces, enemyKing, attack).isKingThreatened === false)
    if (noThreatenedAttack) {
        return false
    }

    return true
}

/**
 * Check if the game ended in a stalemate
 * @param {array} pieces all pieces in the table
 * @param {string} turn player playing
 * @param {string} enemyTeam oposite player
 */
const isStalemate = (pieces, turn, enemyTeam) => {
    const enemyNextMovs = predictions.getEnemyNextMovs(pieces, enemyTeam)
    const teamPieces = general.getPiecesFromTeam(pieces, enemyTeam)
    for (const piece of teamPieces) {
        const decodedPiece = decode.fromPieceDecl(piece)
        const result = predictions.getOptionsByName(pieces, decodedPiece, enemyNextMovs)
        const noThreatenedMov = result.nextMovements.find(movement => predictions.willTheKingBeThreating(pieces, decodedPiece, movement).isKingThreatened === false)
        if (noThreatenedMov) {
            return false
        }
        
        const noThreatenedAttack = result.attacks.find(attack => predictions.willTheKingBeThreating(pieces, decodedPiece, attack).isKingThreatened === false)
        if (noThreatenedAttack) {
            return false
        }
    }

    return true
}

/**
 * Get piece by name
 * @param {array} pieces array of string pieces
 * @param {string} name piece name
 */
const getPieceByName = (pieces, name) => pieces.find(piece => piece[0] === name)

/**
 * Check if it still possible any player win with a checkmate
 * @param {array} pieces all pieces in the table
 */
const isImpossibleCheckmate = pieces =>
        (pieces.length === 2)
        || ( pieces.length === 3 && ( !!getPieceByName(pieces, 'B') || !!getPieceByName(pieces, 'b') || !!getPieceByName(pieces, 'N') || !!getPieceByName(pieces, 'n') ) )
        || ( pieces.length === 4 && !!getPieceByName(pieces, 'B') && !!getPieceByName(pieces, 'b') )


/**
 * Check if the game ended
 * @param {array} pieces all pieces in the table
 * @param {string} turn player playing
 */
const isGameFinished = (pieces, turn, check) => {
    const enemyTeam = turn === 'W' ? 'B' : 'W'
    const inCheck = check ? check : predictions.getThreatenedKingData(pieces, enemyTeam)
    let checkmate = false
    let stalemate = false
    let impossibleCheckmate = false

    if (inCheck.isKingThreatened && isCheckmate(pieces, turn, enemyTeam)) {
        checkmate = true
    } else if (!inCheck.isKingThreatened && isStalemate(pieces, turn, enemyTeam)) {
        stalemate = true
    } else if (isImpossibleCheckmate(pieces)) {
        impossibleCheckmate = true
    }

    return {
        isCheckmate: checkmate,
        isStalemate: stalemate,
        isImpossibleCheckmate: impossibleCheckmate
    }
}

let API = {
    isGameFinished
}

if (general.isTestEnv()) {
    API = Object.assign({}, API, {
        isCheckmate,
        isStalemate,
        getPieceByName,
        isImpossibleCheckmate,
    })
}

module.exports = API
