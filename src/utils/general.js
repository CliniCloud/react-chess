const decode = require('../decode');

/**
 * Check if is a development environment
 */
const isTestEnv = () => process && process.env.NODE_ENV === 'development';

/**
 * Check if is the game turn of a specific piece
 * @param {string} pieceName piece name (eg: 'p', 'B', 'b', 'K', 'k', 'q')
 * @param {string} turn team who should play (eg: 'W', 'B')
 */
const isPieceTurn = (pieceName, turn) => (pieceName === pieceName.toUpperCase() && turn === 'W') || (pieceName === pieceName.toLowerCase() && turn === 'B');

/**
 * Check if a pawn arrive at the top or bottom of the table
 * @param {string} pieceName piece name (eg: 'p', 'B', 'b', 'K', 'k', 'q')
 * @param {object} position object with x and y attributes
 */
const hasPawnPieceChange = (pieceName, position) => pieceName.toLowerCase() === 'p' && ((pieceName === pieceName.toUpperCase() && position.y === 0) || (pieceName === pieceName.toLowerCase() && position.y === 7));

/**
 * Get the piece team
 * @param {string} pieceName piece name (eg: 'p', 'B', 'b', 'K', 'k', 'q')
 */
const whatIsMyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'W' : 'B';

/**
 * Get the enemy team
 * @param {string} pieceName piece name (eg: 'p', 'B', 'b', 'K', 'k', 'q')
 */
const whatIsEnemyTeam = pieceName => pieceName === pieceName.toUpperCase() ? 'B' : 'W';

/**
 * Check if the parameter is between the range
 * @param {number} range 
 */
const isBetweenRange = index => index >= 0 && index <= 7;

/**
 * Get which letter represent the column
 * @param {number} xPosition piece x position
 */
const getColumn = xPosition => isBetweenRange(xPosition) ? String.fromCharCode(decode.charCodeOffset + xPosition) : null;

/**
 * Compare if the pieces are from the same team
 * @param {object} pieceA piece object with name
 * @param {object} pieceB piece object with name
 */
const isPiecesFromSameTeam = (pieceA, pieceB) => (pieceA.name === pieceA.name.toLowerCase() && pieceB.name === pieceB.name.toLowerCase()) || (pieceA.name === pieceA.name.toUpperCase() && pieceB.name === pieceB.name.toUpperCase());

/**
 * Get decoded piece with more information
 * @param {string} piece piece string notation (eg:p-0@g3)
 * @param {number} index list index
 * @param {string} position piece position (eg: g3)
 */
const getPieceObject = (piece, index, pos) =>  {
    const position = !pos || pos.length > 2 ? piece.substr(piece.indexOf('@') + 1) : pos;
    return Object.assign(
        {},
        decode.fromPieceDecl(piece),
        { 
            notation: piece,
            name: piece.slice(0, 1),
            index,
            position
        }
    );
};

/**
 * 
 * @param {array} pieces list of pieces (object)
 * @param {string} pos piece position
 */
const findPieceAtPosition = (pieces, pos) => {
    const newPos = pos.length > 2 ? pos.substr(pos.indexOf('@') + 1) : pos;

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        if (piece.indexOf(newPos) ===  piece.indexOf('@') + 1) {
            return getPieceObject(piece, i, newPos);
        }
    }

    return null;
};

/**
 * Filter the list of pieces by pieces name
 * @param {array} pieces list of pieces (object)
 * @param {string} type pieces name (eg: KQRNB)
 */
const filterByTypeOfPieces  = (pieces, type) => pieces.map(piece => type.toUpperCase().indexOf(piece.name.toUpperCase()) > -1 ? piece : false).filter(Boolean);

/**
 * Compare if the position where the piece was drag out has a same team piece
 * @param {array} pieces pieces list
 * @param {object} draggingPiece decoded piece object
 * @param {string} dragToPos position (eg: e4)
 */
const isSameTeamPiece = (pieces, draggingPiece, dragToPos) => {
    const positionedPiece = findPieceAtPosition(pieces, dragToPos);
    return positionedPiece && isPiecesFromSameTeam(draggingPiece, positionedPiece);
};

/**
 * Check if the movement choose by user is among the piece allowed movements and attacks
 * @param {array} nextPossMov piece allowed movements
 * @param {array} attacks piece allowed attacks
 * @param {object} piece decoded piece object
 */
const isMovementValid = (nextPossMov, attacks, piece) => {
    const y = 7 - piece.y;
    const foundMov = nextPossMov.find(mov => mov.x === piece.x && mov.y === y);
    if(foundMov){
        return foundMov;
    }

    const foundAttack = attacks.find(attack => attack.x === piece.x && attack.y === y);
    if(foundAttack){
        return foundAttack
    }

    return null;
};

/**
 * Get all pieces from a team
 * @param {array} pieces pieces array
 * @param {string} team team name
 */
const getPiecesFromTeam = (pieces, team) => 
     pieces.map(item => {
        if (team.toUpperCase() === 'W' && item[0].toUpperCase() === item[0]) {
            return item;
        } else if (team.toUpperCase() === 'B' && item[0].toLowerCase() === item[0]) {
            return item;
        }
        
        return null;
    }).filter(Boolean);

/**
 * Get the king threatening position in case it is in the piece's allowed attacks
 * @param {array} attacks possible attacks
 * @param {object} threateningPos king's threatening enemy's pos
 */
const getThreateningAttack = (attacks, threateningPos) => {
    if (threateningPos) {
        const threathPos = decode.fromPieceDecl(threateningPos);
        const newAttacks = [];
        for (const attack of attacks) {
            if (attack.x === threathPos.x && attack.y === threathPos.y) {
                newAttacks.push(attack);
                break;
            }
        }
        
        return newAttacks;
    }

    return null;
}

module.exports = {
    isTestEnv,
    isPieceTurn,
    hasPawnPieceChange,
    whatIsMyTeam,
    whatIsEnemyTeam,
    isBetweenRange,
    getColumn,
    isPiecesFromSameTeam,
    getPieceObject,
    filterByTypeOfPieces,
    findPieceAtPosition,
    isSameTeamPiece,
    isMovementValid,
    getPiecesFromTeam,
    getThreateningAttack
};
