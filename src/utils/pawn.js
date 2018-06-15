const general = require('./general');
const decode = require('../decode');

/**
 * Create pawn next movement and attack by board position
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} pawPosition paw position
 * @param {string} column board column
 * @param {int} colIndex pawn column index
 */
const createMovAttackByPos = (pieces, piece, colIndex) => {
    const column = general.getColumn(piece.x - colIndex);
    if (column) {
        const squarePiece = general.findPieceAtPosition(pieces, `${column}${piece.row +1}`);
        if (colIndex === 0 && squarePiece === null) {
            const nextMovement = [];
            for (let rowIndex = 0; rowIndex < piece.lengthRows; rowIndex++) {
                nextMovement.push({
                    x: piece.x - colIndex,
                    y: piece.name === piece.name.toLowerCase() ? piece.row - rowIndex : piece.row + rowIndex
                });
            }
            return {
                nextMovement
            };
        } else if (colIndex !== 0) {
            if (squarePiece) {
                if (!general.isPiecesFromSameTeam(squarePiece, piece, piece.row)) {
                    return {
                        attack: {
                            x: piece.x - colIndex,
                            y: piece.row
                        }
                    };
                }
            }
        }
    }

    return null;
};

/**
 * Create pawn next movements and attacks
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 */
const createMovsAttacks = (pieces, piece) => {
    let nextMovements = [];
    const attacks = [];
    piece.row = piece.name === piece.name.toLowerCase() ? piece.y - 1 : piece.y + 1; //row will change depending wich team
    piece.lengthRows = piece.qntPlayed === 0 ? 2 : 1; //first time pawn may move two spaces

    for (let colIndex = -1; colIndex < 2; colIndex++) {
        const result = createMovAttackByPos(pieces, piece, colIndex);
        if (result && result.attack) {
            attacks.push(result.attack);
        } else if (result && result.nextMovement) {
            nextMovements = nextMovements.concat(result.nextMovement);
        }
    }

    return {
        attacks,
        nextMovements
    };
};

/**
 * Create pawn next movements and attacks considering if its kings is threatened
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {objcet} threateningPos king's threating position
 */
const getOptions = function(pieces, piece, threateningPos) {
    const result = createMovsAttacks(pieces, piece);
    let attacks = result.attacks;

    if (threateningPos) {
        const threathPos = decode.fromPieceDecl(threateningPos);
        const newAttacks = attacks.find(attack => attack.x === threathPos.x && attack.y === threathPos.y);
        if(newAttacks){
            attacks = [newAttacks];
        }
    }

    return {
        nextMovements: result.nextMovements,
        attacks
    };
}

/**
 * Returns enemy's pawns attacks
 * @param {array} pieces all current pieces
 * @param {string} enemyTeam enemy team initial
 */
const getEnemyPawnsAttacks = (pieces, enemyTeam) => {
    const attackerPositions = [];
    for (const piece of pieces) {
        let piecePos;
        let rowIndex;
        const enemyName = piece[0].toUpperCase();

        if (enemyName === 'P') {
            if (enemyTeam === 'W' && piece[0] === enemyName) {
                piecePos = piece;
                rowIndex = +1;
            } else if (enemyTeam === 'B' && piece[0] === piece[0].toLowerCase()) {
                piecePos = piece;
                rowIndex = -1;
            }

            if (piecePos) {
                const attacker = decode.fromPieceDecl(piecePos);
                attackerPositions.push(Object.assign({}, attacker, {
                    x: attacker.x + 1,
                    y: attacker.y + rowIndex
                }));
                attackerPositions.push(Object.assign({}, attacker, {
                    x: attacker.x - 1,
                    y: attacker.y + rowIndex
                }));
            }
        }
    }

    return attackerPositions;
};

let  API = {
    getOptions,
    getEnemyPawnsAttacks
};

if(general.isTestEnv()){
    API = Object.assign({}, API, {
        createMovAttackByPos,
        createMovsAttacks
    });
}

module.exports = API;
