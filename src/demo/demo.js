const React = require('react')
const Chess = require('../../src/react-chess')

require('./demo.css')

class Demo extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {pieces: Chess.getDefaultLineup()}
    this.handleMovePiece = this.handleMovePiece.bind(this)
    this.onPawChooseNewPiece = this.onPawChooseNewPiece.bind(this)
  }

  handleMovePiece(piece, fromSquare, toSquare, qntPlayed) {
    const newPieces = this.state.pieces
      .map((curr, index) => {
        if (piece.index === index) {
          return `${piece.name}-${qntPlayed}@${toSquare}`
        } else if (curr.indexOf(toSquare) === 4) {
          return false // To be removed from the board
        }
        return curr
      })
      .filter(Boolean)

    this.setState({pieces: newPieces})
  }

  onPawChooseNewPiece(oldPiece, newPiece, newPieceName){
      console.log('pieces', this.state.pieces);
      console.log('oldPiece', oldPiece);
      console.log('newPiece', newPiece);

     const newPieces =  this.state.pieces
      .map((curr, index) => {
          if(curr === newPiece){
              return newPiece.replace(newPiece[0],newPieceName)
          }
          return curr
      }).filter(Boolean)

      this.setState({pieces: newPieces})
  } 

  render() {
    const {pieces} = this.state
    return (
      <div className="demo">
        <Chess pieces={pieces} onMovePiece={this.handleMovePiece} onPawChooseNewPiece={this.onPawChooseNewPiece} />
      </div>
    )
  }
}

module.exports = Demo
