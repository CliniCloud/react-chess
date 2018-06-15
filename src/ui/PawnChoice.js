const React = require('react');
const PropTypes = require('prop-types');
const pieces = require('../pieces');

const pieceChooserStyle = {
    width: "100px",
    position: "absolute",
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: "column",
};

const opacityStyle = {
    opacity:0.2
};

const linkPieceChooser = {
    backgroundColor: '#707070',
    borderRadius: '50%',
    transition: '.75s',
    height: '95px',
};

const linkPieceChooserHover = Object.assign(
    {},
    linkPieceChooser,
    {
        boxShadow: 'inset 0 0 80px 8px #d85000',
        borderRadius: '10px',
        backgroundColor: '#707070',
    });

class PawnChoice extends React.Component {
    constructor(...args){
        super(...args);
        this.state = {
            bishofHover:false,
            queenHover:false,
            knightHover:false,
            rookHover:false,
        };
    }
    render(){
        const toggleHover = name => this.setState({ [`${name}Hover`]: !this.state[`${name}Hover`] });
        const queenStyle = this.state.queenHover ? linkPieceChooserHover : linkPieceChooser;
        const bishofStyle = this.state.bishofHover ? linkPieceChooserHover : linkPieceChooser;
        const knightStyle = this.state.knightHover ? linkPieceChooserHover : linkPieceChooser;
        const rookStyle = this.state.rookHover ? linkPieceChooserHover : linkPieceChooser;

        return (
        <div>
            <div style={opacityStyle}>
                { this.props.children }
            </div>
            <div className="piece-chooser" style={pieceChooserStyle}>
                <a href="/" style={queenStyle} onMouseEnter={env => toggleHover('queen')} onMouseLeave={env => toggleHover('queen')} onClick={evt => this.props.selectPawNewPiece(evt, 'Q')}>
                    < pieces.Q menu={true}/>
                </a>
                <a href="/" style={knightStyle} onMouseEnter={env => toggleHover('knight')} onMouseLeave={env => toggleHover('knight')} onClick={evt => this.props.selectPawNewPiece(evt, 'N')}>
                    <pieces.N menu={true}/>
                </a>
                <a href="/" style={rookStyle} onMouseEnter={env => toggleHover('rook')} onMouseLeave={env => toggleHover('rook')} onClick={evt => this.props.selectPawNewPiece(evt, 'R')}>
                    <pieces.R menu={true}/>
                </a>
                <a href="/" style={bishofStyle} onMouseEnter={env => toggleHover('bishof')} onMouseLeave={env => toggleHover('bishof')} onClick={evt => this.props.selectPawNewPiece(evt, 'B')}>
                    <pieces.B menu={true}/>
                </a>
            </div>
        </div>);
    }
};

PawnChoice.propTypes = {
    selectPawNewPiece: PropTypes.func,
    children: PropTypes.any,
};

PawnChoice.defaultProps = {
    selectPawNewPiece: ()=>{/* intentional noop */},
};

module.exports = PawnChoice;
