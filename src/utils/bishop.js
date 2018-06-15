const general = require('./general');

/**
 * Create movement and attack based in board position
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} endDir object with flags storing for which direction the movements still should be created
 */
const getAttacktNextMov = (pieces, piece, endDir) => {
    const column = general.getColumn(piece.col)

    if (column) {
        const squarePiece = general.findPieceAtPosition(pieces, `${column}${piece.row+1}`);
        if (squarePiece) {
            if (!general.isPiecesFromSameTeam(squarePiece, piece)) {
                return {
                    attack: {
                        x: piece.col,
                        y: piece.row
                    },
                    endDir: Object.assign({},
                        endDir, {
                            [piece.side]: true
                        }
                    ),
                };
            }

            return {
                endDir: Object.assign({},
                    endDir, {
                        [piece.side]: true
                    }
                ),
            };
        }

        return {
            nextMov: {
                x: piece.col,
                y: piece.row
            },
            endDir,
        };
    }

    return null;
};

/**
 * Validate x and y position are valid on the board limits
 * @param {object} piece decoded piece
 */
const isPositionValid = piece => (piece.x !== piece.col || piece.y !== piece.row) && piece.row >= 0 && piece.row < 8 && piece.col >= 0 && piece.col < 8;

/**
 * Validate if x and y are inside of bishop top left movements and attacks
 * @param {object} piece decoded piece
 * @param {object} endDir flag container to check if movements for especific side finished
 */
const isTopLeftPosition = (piece, endDir) => piece.side === 'topLeft' && !endDir.topLeft && piece.col < piece.x && piece.row > piece.y;

/**
 * Validate if x and y are inside of bishop down left movements and attacks
 * @param {object} piece decoded piece
 * @param {object} endDir flag container to check if movements for especific side finished
 */
const isDownLeftPosition = (piece, endDir) => piece.side === 'downLeft' && !endDir.downLeft && piece.row < piece.y && piece.col < piece.x;

/**
 * Validate if x and y are inside of bishop down right movements and attacks
 * @param {object} piece decoded piece
 * @param {object} endDir flag container to check if movements for especific side finished
 */
const isDownRightPosition = (piece, endDir) => piece.side === 'downRight' && !endDir.downRight && piece.col > piece.x && piece.row < piece.y;

/**
 * Validate if x and y are inside of bishop top right movements and attacks
 * @param {object} piece decoded piece
 * @param {object} endDir flag container to check if movements for especific side finished
 */
const isTopRightPosition = (piece, endDir) => piece.side === 'topRight' && !endDir.topRight && piece.row > piece.y && piece.col > piece.x;

/**
 * Generate movements and attacks per side
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} endDir flag container to check if movements for especific side finished
 * @param {int} index board row/col index
 * @param {string} side which side position it will generate movs
 */
const generateBishopPos = (pieces, piece, endDir, index, side) => {
    const newPiece = Object.assign({}, piece, {
        side,
    });
    newPiece.col = side === 'topLeft' ? piece.x - index : piece.x + index;
    newPiece.row = side === 'downRight' ? piece.y - index : piece.y + index;

    if (isPositionValid(newPiece)) {
        if (isTopLeftPosition(newPiece, endDir) || isDownRightPosition(newPiece, endDir) || isTopRightPosition(newPiece, endDir) || isDownLeftPosition(newPiece, endDir)) {
            return getAttacktNextMov(pieces, newPiece, endDir);
        }
    }

    return null;
}

/**
 * Compare old and new end of direction attributes and generate a new one
 * @param {object} endDir flag container to check if movements for especific side finished
 * @param {object} endDir flag container to check if movements for especific side finished
 */
const compareEndDirs = (oldEndDir, newEndDir) => {
    return {
        topLeft: oldEndDir.topLeft || newEndDir.topLeft,
        topRight: oldEndDir.topRight || newEndDir.topRight,
        downRight: oldEndDir.downRight || newEndDir.downRight,
        downLeft: oldEndDir.downLeft || newEndDir.downLeft
    };
}

/**
 * Get next movements and attacks
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} threateningPos enemyś threatening king position
 */
const getOptions = (pieces, piece, threateningPos) => {
    const nextMovements = [];
    let attacks = [];
    let endedDirection = {
        topLeft: false,
        topRight: false,
        downRight: false,
        downLeft: false
    };

    for (let i = 0; i < 8; i++) {
        const topRight = generateBishopPos(pieces, piece, endedDirection, i, 'topRight');
        const topLeft = generateBishopPos(pieces, piece, endedDirection, i, 'topLeft');
        const downRight = generateBishopPos(pieces, piece, endedDirection, i, 'downRight');
        const downLeft = generateBishopPos(pieces, piece, endedDirection, i * -1, 'downLeft');

        for (const item of [topRight, downLeft, topLeft, downRight]) {
            if (item) {
                if (item.nextMov) {
                    nextMovements.push(item.nextMov);
                }
                if (item.attack) {
                    attacks.push(item.attack);
                }
                if (item.endDir) {
                    endedDirection = compareEndDirs(endedDirection, item.endDir);
                }
            }
        }
    }

    const threatAttacks = general.getThreateningAttack(attacks, threateningPos);
    if (threatAttacks) {
        attacks = threatAttacks;
    }

    return {
        nextMovements,
        attacks
    };
}

let API = {
    getOptions
};

if (general.isTestEnv()) {
    API = Object.assign({}, API, {
        getAttacktNextMov,
        isPositionValid,
        isTopLeftPosition,
        isDownLeftPosition,
        isDownRightPosition,
        isTopRightPosition,
        generateBishopPos,
        compareEndDirs,
    });
}

module.exports = API;
