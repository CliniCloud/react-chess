const bishop = require('./bishop');
const rook = require('./rook');

/**
 * Get next movements and attacks from queen
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} threateningPos enemyś threatening king position
 */
 const getOptions = (pieces, piece, threateningPos) =>{
    let nextMovements = [];
    let attacks = [];

    const bishopResult = bishop.getOptions(pieces, piece, threateningPos);
    nextMovements = nextMovements.concat(bishopResult.nextMovements);
    attacks = attacks.concat(bishopResult.attacks);

    const rookResult = rook.getOptions(pieces, piece, threateningPos);
    nextMovements = nextMovements.concat(rookResult.nextMovements);
    attacks = attacks.concat(rookResult.attacks);

    return {
        nextMovements,
        attacks
    };
};

module.exports = {
    getOptions
};
