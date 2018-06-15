const React = require('react');
const Chess = require('../../src/react-chess');

require('./demo.css');

class Demo extends React.PureComponent {
    constructor(...args) {
        super(...args)
        this.state = {
            pieces: Chess.getDefaultLineup()
        };
        this.handleMovePiece = this.handleMovePiece.bind(this);
        this.onPawChooseNewPiece = this.onPawChooseNewPiece.bind(this);
    }

    handleMovePiece(piece, fromSquare, toSquare, qntPlayed, castlingRookPos) {
        const newPieces = this.state.pieces
            .map(curr => {
                if (curr.substr(curr.indexOf('@') + 1) === fromSquare) {
                    return `${piece.name}-${qntPlayed}@${toSquare}`;
                } else if (curr.indexOf(toSquare) > -1) {
                    return false; // To be removed from the board
                }else if(castlingRookPos && curr === castlingRookPos.notation){
                    return `${castlingRookPos.name}-${castlingRookPos.qntPlayed + 1}@${castlingRookPos.nextPos}`;
                }
                return curr;
            })
            .filter(Boolean);
            
        this.setState({
            pieces: newPieces
        });
    }

    onPawChooseNewPiece(oldPiece, newPiece, newPieceName) {
        const newPieces = this.state.pieces
            .map(curr => {
                if (curr === newPiece) {
                    return newPiece.replace(newPiece[0], newPieceName);
                }
                return curr;
            }).filter(Boolean);

        this.setState({
            pieces: newPieces
        });
    }

    render() {
        const {pieces} = this.state;
        return (
            <div className="demo">
              <Chess pieces={ pieces } onMovePiece={ this.handleMovePiece } onPawChooseNewPiece={ this.onPawChooseNewPiece } />
            </div>
        );
    }
}

module.exports = Demo;
