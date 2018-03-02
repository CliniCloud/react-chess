const decode = require('../decode')
const bishop = require('./bishop')
const rook = require('./rook')
const knight = require('./knight')
const pawn = require('./pawn')
const king = require('./king')
const queen = require('./queen')

module.exports.isPiecesFromSameTeam = (pieceA, pieceB) => {
    return (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) ||
        (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase())
}

module.exports.findPieceAtPosition = (pieces, pos) => {
    const newPos = pos.length > 2 ? pos.substr(4) : pos

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i]
        if (piece.indexOf(newPos) === 4) {
            return {
                notation: piece,
                name: piece.slice(0, 1),
                index: i,
                position: newPos
            }
        }
    }

    return null
}

module.exports.isSameTeamPiece = (pieces, draggingPiece, dragToPos) => {
    const positionedPiece = this.findPieceAtPosition(pieces, dragToPos)
    return positionedPiece && this.isPiecesFromSameTeam(draggingPiece, positionedPiece)
}

module.exports.isValidRange = range => range >= 0 && range <= 7

module.exports.getColumn = (code) => {
    if (!this.isValidRange(code)) {
        return null
    }

    return String.fromCharCode(decode.charCodeOffset + code)
}

module.exports.isValidMovement = (nextPossMov, attacks, piece) => {
    const y = 7 - piece.y
    for (let mov of nextPossMov) {
        if (mov.x === piece.x && mov.y === y) {
            return true
        }
    }

    for (let attack of attacks) {
        if (attack.x === piece.x && attack.y === y) {
            return true
        }
    }

    return false
}

module.exports.isPieceTurn = (pieceName, turn) => (pieceName === pieceName.toUpperCase() && turn === 'W') || (pieceName === pieceName.toLowerCase() && turn === 'B')

module.exports.hasPawnPieceChange = (pieceName, position) => pieceName.toLowerCase() === 'p' && ((pieceName === pieceName.toUpperCase() && position.y === 0) || (pieceName === pieceName.toLowerCase() && position.y === 7))

module.exports.whatIsMyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'W' : 'B'

module.exports.whatIsEnemyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'B' : 'W'


module.exports.getOptionsByName = (pieces, piece, enemysPossibleMov, threateningPos) => {
    const upperName = piece.name.toUpperCase()
    switch (upperName) {
        case 'P':
            return pawn.getOptions(pieces, piece, threateningPos)
        case 'N':
            return knight.getOptions(pieces, piece, threateningPos)
        case 'R':
            return rook.getOptions(pieces, piece, threateningPos)
        case 'B':
            return bishop.getOptions(pieces, piece, threateningPos)
        case 'K':
            return king.getOptions(pieces, piece, enemysPossibleMov)
        case 'Q':
            return queen.getOptions(pieces, piece, threateningPos)
        default:
            return null
    }
}


module.exports.isEnemyThreateningKing = (pieces, currTeam) => {
    const enemysPossibleMov = []
    const enemysPossibleAttacks = []
    const attackerPositions = []
    for (const piece of pieces) {
        var piecePos,
            pieceName
        if (currTeam === 'B' && piece[0] === piece[0].toUpperCase()) {
            piecePos = piece
            pieceName = piece.substr(0, 1)
        } else if (currTeam === 'W' && piece[0] === piece[0].toLowerCase()) {
            piecePos = piece
            pieceName = piece.substr(0, 1)
        }

        if (piecePos && pieceName) {
            const pieceObj = this.findPieceAtPosition(pieces, piecePos)
            const result = this.getOptionsByName(pieces, pieceObj, null)
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
    for (const index in enemysPossibleAttacks) {
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
        enemysPossibleMov: isKingThreatened ? enemysPossibleMov : null,
        threateningPos
    }
}

function getKingPos(pieces, team) {
    var kingPos
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