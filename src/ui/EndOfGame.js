const React = require('react');
const PropTypes = require('prop-types');

class EndOfGame extends React.PureComponent {

    render(){
        const wrapperStyle = {
            display:'flex',
            justifyContent:'center',
            width: '100%',
            position: 'absolute',
            top:'45%',
            fontSize:'45px',
            color:'#0d8dcb'
        };

        const endOfGameWrapper = content => (
            <div>
                <div style={{opacity:'0.2'}}>
                    {this.props.children}
                </div>
                <div style={wrapperStyle}>
                    {content}
                </div>
            </div>
        );

        if(this.props.isCheckmate){
            return endOfGameWrapper(
              <h2>
                Checkmate from
                <span style={{color:this.props.turn === 'B' ? '#d8d8d8' : 'black'}}>
                  {this.props.turn === 'B' ? 'White' : 'Black'}
                </span>
              </h2>);
        }else if(this.props.isStalemate){
            return endOfGameWrapper(
              <h2>
                Stalemate from
                <span style={{color:this.props.turn === 'B' ? '#d8d8d8' : 'black'}}>
                  {this.props.turn === 'B' ? 'White' : 'Black'}
                </span>
              </h2>);
        }else if(this.props.isImpossibleCheckmate){
            return endOfGameWrapper(<h2>The game has finished in a draw</h2>);
        }

        return null;
    }
}

EndOfGame.propTypes = {
    isCheckmate: PropTypes.bool,
    isStalemate: PropTypes.bool,
    isImpossibleCheckmate: PropTypes.bool,
    turn: PropTypes.string,
    children: PropTypes.any,
};

EndOfGame.defaultProps = {
    isCheckmate: false,
    isStalemate: false,
    isImpossibleCheckmate: false,
    turn: 'W',
};

module.exports = EndOfGame;
