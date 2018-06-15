const general = require('./general')

const allowedMovements = [{
  x: 1,
  y: 2,
}, {
  x: -1,
  y: 2,
}, {
  x: 2,
  y: 1,
}, {
  x: -2,
  y: 1,
}, {
  x: 2,
  y: -1,
}, {
  x: -2,
  y: -1,
}, {
  x: 1,
  y: -2,
}, {
  x: -1,
  y: -2,
}];

/**
 * validate if x and y position are a allowed knight movement
 * @param {arrat} range list of possible knight movements
 * @param {int} x x board position
 * @param {int} y y board position
 */
const isRangeMatch = (x, y) => !!allowedMovements.find(item => item.x === x && item.y === y);

/**
 * Create movement and attack based in board position
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {int} xPos knight x position
 */
const getAttacktNextMov = (pieces, piece, xPos) => {
  const column = general.getColumn(xPos);
  const attacks = [];
  const nextMovements = [];
  if (column) {
    for (let row = -2; row < 3; row++) {
      const yPos = piece.y + row;
      if (yPos - piece.y !== 0 && general.isBetweenRange(yPos) && isRangeMatch(xPos - piece.x, yPos - piece.y)) {
        const squarePiece = general.findPieceAtPosition(pieces, `${column}${yPos + 1}`);
        if (squarePiece && !general.isPiecesFromSameTeam(squarePiece, piece)) {
          attacks.push({
            x: xPos,
            y: yPos,
          });
        } else {
          nextMovements.push({
            x: xPos,
            y: yPos,
          });
        }
      }
    }
  }
  return {
    attacks,
    nextMovements,
  };
};

/**
 * Get next movements and attacks 
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} threateningPos enemy's position threatening king
 */
const getOptions = function (pieces, piece, threateningPos) {
  let nextMovements = [];
  let attacks = [];
  for (let col = -2; col < 3; col++) {
    const movAtt = getAttacktNextMov(pieces, piece, piece.x - col);
    if (movAtt && movAtt.attacks.length) {
      attacks = attacks.concat(movAtt.attacks);
    }

    if (movAtt && movAtt.nextMovements.length) {
      nextMovements = nextMovements.concat(movAtt.nextMovements);
    }
  }

  const threatenedAttacks = general.getThreateningAttack(attacks, threateningPos);
  if (threatenedAttacks) {
    attacks = threatenedAttacks;
  }

  return {
    nextMovements,
    attacks,
  };
};

let API = {
  getOptions,
};

if (general.isTestEnv()) {
  API = Object.assign({}, API, {
    getAttacktNextMov,
    isRangeMatch,
  });
}

module.exports = API;
