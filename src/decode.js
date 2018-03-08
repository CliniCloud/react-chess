const charCodeOffset = 97

module.exports = {
  fromPieceDecl: pos => {
    const [pieces, square] = pos.split('@')
    const [piece, qntPlayed] = pieces.split('-')
    const x = square.toLowerCase().charCodeAt(0) - charCodeOffset
    const y = Number(square[1]) - 1
    return {x, y, piece, square, qntPlayed: parseInt(qntPlayed, 0)}
  },

  fromPosDecl: (x, y) => `${String.fromCharCode(charCodeOffset + x )}${y + 1}`,

  charCodeOffset
}
