const decode = require('../decode')
const general = require('./general')
const bishop = require('./bishop')
const rook = require('./rook')
const knight = require('./knight')
const pawn = require('./pawn')
const king = require('./king')
const queen = require('./queen')

/**
 * Get next movements and attacks by piece
 * @param {array} pieces string array
 * @param {object} piece piece object
 * @param {array} enemysPossibleMov enemy's next possible movements
 * @param {object} threateningPos posistion of enemy threatening
 */
const getOptionsByName = (pieces, piece, enemysPossibleMov, threateningPos) => {
    const upperName = piece.name.toUpperCase()
    switch (upperName) {
        case 'P':
            return pawn.getOptions(pieces, piece, threateningPos)
        case 'N':
            return knight.getOptions(pieces, piece, threateningPos)
        case 'R':
            return rook.getOptions(pieces, piece, threateningPos)
        case 'K':
            return king.getOptions(pieces, piece, enemysPossibleMov, threateningPos)
        case 'B':
            return bishop.getOptions(pieces, piece, threateningPos)
        case 'Q':
            return queen.getOptions(pieces, piece, threateningPos)
        default:
            return null
    }
}

/**
 * Get the team's king position
 * @param {array} pieces string array
 * @param {string} team current team
 */
const getKingPos = (pieces, team) => {
    const kingPos = pieces.find(piece =>
        (team === 'B' && piece[0] === piece[0].toLowerCase() && piece[0] === 'k') ||
        (team === 'W' && piece[0] === piece[0].toUpperCase() && piece[0] === 'K'))

    if (kingPos) {
        return Object.assign({}, {
                notation: kingPos
            },
            decode.fromPieceDecl(kingPos)
        )
    }

    return false
}

/**
 * Get enemy's next movements, attacks and attackers positions
 * @param {array} pieces string array of pieces
 * @param {string} currTeam current team
 */
const getEnemyPositions = (pieces, currTeam) => {
    const enemysPossibleMov = []
    const enemysPossibleAttacks = []
    const attackerPositions = []
    for (const piece of pieces) {
        let piecePos
        let pieceName
        if (currTeam === 'B' && piece[0] === piece[0].toUpperCase()) {
            piecePos = piece
            pieceName = piece.substr(0, 1)
        } else if (currTeam === 'W' && piece[0] === piece[0].toLowerCase()) {
            piecePos = piece
            pieceName = piece.substr(0, 1)
        }

        if (piecePos && pieceName) {
            const pieceObj = general.findPieceAtPosition(pieces, piecePos)
            const result = getOptionsByName(pieces, pieceObj, null)
            enemysPossibleMov.push({
                nextMovements: result.nextMovements,
                name: pieceObj.name
            })
            if (result.attacks.length) {
                enemysPossibleAttacks.push(result.attacks)
            }
            attackerPositions.push(piecePos)
        }
    }

    return {
        enemysPossibleMov,
        enemysPossibleAttacks,
        attackerPositions
    }
}

/**
 * Check if enemy is threatening the current team's king
 * 
 * @param {array} pieces string array of pieces
 * @param {string} currTeam current team
 */
const getThreatenedKingData = (pieces, currTeam) => {
    const enemysPos = getEnemyPositions(pieces, currTeam)
    const enemysPossibleMov = enemysPos.enemysPossibleMov
    const enemysPossibleAttacks = enemysPos.enemysPossibleAttacks
    const attackerPositions = enemysPos.attackerPositions

    const kingPos = getKingPos(pieces, currTeam)
    let isKingThreatened = false
    let threateningPos = null
    for (let index = 0; index < enemysPossibleAttacks.length; index++) {
        const attacks = enemysPossibleAttacks[index]
        for (const attack of attacks) {
            if (attack.x === kingPos.x && attack.y === kingPos.y) {
                isKingThreatened = true
                threateningPos = attackerPositions[index]
                break
            }
        }
    }

    return {
        isKingThreatened,
        threatenedKingPos: isKingThreatened ? kingPos : null,
        enemysPossibleMov: enemysPossibleMov,
        threateningPos
    }
}

/**
 * Check if changing the piece's position will leave the king threatened
 * @param {array} pieces string array
 * @param {object} piece decoded piece object
 * @param {object} newPosition piece new position object
 */
const willTheKingBeThreating = (pieces, piece, newPosition) => {
    let replacedEnemy = false
    let kinsIsDead = false
    const newMovPos = decode.fromPosDecl(newPosition.x, newPosition.y)
    const newPieces = pieces.map((item, index) => {
        const pos = item.substr(item.indexOf('@') + 1)
        if (piece.position === pos) {
            return false
        } else if (pos === newMovPos) {
            replacedEnemy = true
            kinsIsDead = item.toUpperCase().indexOf('K') > -1
            return `${piece.notation.substr(0, item.indexOf('@'))}@${pos}`
        }
        return item
    }).filter(Boolean)

    if (!replacedEnemy) {
        newPieces.push(`${piece.name}-0@${newMovPos}`)
    }

    let enemyThreat = getThreatenedKingData(newPieces, general.whatIsMyTeam(piece.name))
    enemyThreat = Object.assign({}, enemyThreat, {
        kinsIsDead
    })
    return enemyThreat
}

/**
 * Get enemies next allowed movements
 * @param {array} pieces string array piece
 * @param {string} enemyTeamName enemy team name ('B' or 'W')
 */
const getEnemyNextMovs = (pieces, enemyTeamName) => {
    const movs = []
    for (const piece of pieces) {
        let shouldAddPiece = false
        if (enemyTeamName === 'B' && piece[0] === piece[0].toUpperCase()) {
            shouldAddPiece = true
        } else if (enemyTeamName === 'W' && piece[0] === piece[0].toLowerCase()) {
            shouldAddPiece = true
        }

        if (shouldAddPiece) {
            const decodedPiece = decode.fromPieceDecl(piece)
            const result = getOptionsByName(pieces, decodedPiece)
            movs.push({
                nextMovements: result.nextMovements,
                name: decodedPiece.name
            })
        }
    }

    return movs
}

let API = {
    getOptionsByName,
    getKingPos,
    getThreatenedKingData,
    willTheKingBeThreating,
    getEnemyNextMovs
}

if (general.isTestEnv()) {
    API = Object.assign({}, API, {
        getEnemyPositions
    })
}

module.exports = API