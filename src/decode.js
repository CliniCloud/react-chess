const charCodeOffset = 97

/**
 * Get piece object based on the representation
 * @param {string} pos piece string representation (eg:p-12@h6)
 * @returns {object}
 */
const fromPieceDecl = pos => {
    if(pos.indexOf('@') === -1 || pos.indexOf('-') === -1){
        return null
    }
    const [pieces, square] = pos.split('@')
    const [piece, qntPlayed] = pieces.split('-')
    const x = square.toLowerCase().charCodeAt(0) - charCodeOffset
    const y = Number(square[1]) - 1
    return {
        x,
        y,
        piece,
        square,
        qntPlayed: parseInt(qntPlayed, 10),
        name: piece,
        notation: pos,
        position: square
    }
}

/**
 * Get the position in notation (eg: g5)
 * @param {number} x x piece position
 * @param {number} y y piece position
 * @returns {string}
 */
const fromPosDecl = (x, y) => `${String.fromCharCode(charCodeOffset + x )}${y + 1}`

module.exports = {
  fromPieceDecl,
  fromPosDecl,
  charCodeOffset
}
