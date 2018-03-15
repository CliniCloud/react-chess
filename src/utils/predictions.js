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
                return king.getOptions(pieces, piece, enemysPossibleMov)
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
    let kingPos
    for (const piece of pieces) {
        if (piece[0].toUpperCase() === 'K') {
            if (team === 'B' && piece[0] === piece[0].toLowerCase()) {
                kingPos = piece
                break
            } else if (team === 'W' && piece[0] === piece[0].toUpperCase()) {
                kingPos = piece
                break
            }
        }
    }

    if (kingPos) {
        return Object.assign({
            notation: kingPos
        }, decode.fromPieceDecl(kingPos))
    }

    return false
}

/**
 * Check if enemy is threatening the current team's king
 * 
 * @param {array} pieces string array of pieces
 * @param {string} currTeam current team
 */
const isEnemyThreateningKing = (pieces, currTeam) => {
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
            enemysPossibleAttacks.push(result.attacks)
            attackerPositions.push(piecePos)
        }
    }

    const kingPos = getKingPos(pieces, currTeam)
    let isKingThreatened = false
    let threateningPos = null
    for(let index = 0; index < enemysPossibleAttacks.length; index++) {
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
 * @param {object} piece piece object
 * @param {object} newPosition piece new position object
 */
const willTheKingBeThreating = (pieces, piece, newPosition) => {
    let replacedEnemy = false
    const newMovPos = decode.fromPosDecl(newPosition.x, newPosition.y)
    const newPieces = pieces.map(( item, index) => {
        const pos = item.substr(item.indexOf('@') + 1)    
        if(piece.position === pos){
            return false
        }else if(pos === newMovPos){
            replacedEnemy = true
            return `${piece.notation.substr(0, item.indexOf('@'))}@${pos}`
        }
        return item
    }).filter(Boolean)

    if(!replacedEnemy){
        newPieces.push(`${piece.name}-0@${newMovPos}`)
    }

    return isEnemyThreateningKing(newPieces, general.whatIsMyTeam(piece.name))
}

const getEnemyNextMovs = (pieces, enemyTeamName)=> {
    const movs = []
    for (const piece of pieces) {
        let shouldAddPiece = false
        if (enemyTeamName === 'B' && piece[0] === piece[0].toUpperCase()) {
            shouldAddPiece = true
        } else if (enemyTeamName === 'W' && piece[0] === piece[0].toLowerCase()) {
            shouldAddPiece = true
        }

        if (shouldAddPiece) {
            const  decodedPiece = decode.fromPieceDecl(piece)
            const result = getOptionsByName(pieces, decodedPiece)
            movs.push({
                nextMovements:result.nextMovements,
                name: decodedPiece.name
            })
        }
    }

    return movs
}

module.exports = {
    getOptionsByName,
    isEnemyThreateningKing,
    willTheKingBeThreating,
    getEnemyNextMovs
}