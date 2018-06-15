const React = require('react');
const PropTypes = require('prop-types');
const resizeAware = require('react-resize-aware');
const defaultLineup = require('./defaultLineup');
const general = require('./utils/general');
const decode = require('./decode');
const predictions = require('./utils/predictions');
const endGame = require('./utils/endGame');
const EndOfGame = require('./ui/EndOfGame');
const PawnChoice = require('./ui/PawnChoice');
const board = require('./utils/board');

const boardStyles = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
};
const ResizeAware = resizeAware.default || resizeAware;
const getDefaultLineup = () => defaultLineup.slice();
const noop = () => {
    /* intentional noop */
};

class Chess extends React.Component {
    constructor(...args) {
        super(...args);

        this.els = {};
        this.state = {
            turn: args[0].whiteStarts ? 'W' : 'B',
            attacks: [],
            nextMovements: [],
            isPawnChoosing: false,
            allowMoves: args[0].allowMoves,
            isCheckmate: false,
            isStalemate: false,
            shouldTestGameEnded: false,
        };
        this.setBoardRef = el => (this.els.board = el);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.selectPawNewPiece = this.selectPawNewPiece.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.isPawChoseNewPiece) {
            const enemyThreathingData = predictions.getThreatenedKingData(nextProps.pieces, nextState.turn);
            this.setState(Object.assign({}, {
                    isPawChoseNewPiece: false,
                    shouldTestGameEnded: true
                },
                enemyThreathingData));
        } else if (nextProps.pieces !== this.props.pieces) {
            this.setState(endGame.isGameFinished(nextProps.pieces, nextState.turn));
        } else if (nextState.shouldTestGameEnded) {
            const threateningData = {
                isKingThreatened: nextState.isKingThreatened,
                threateningPos: nextState.threateningPos
            };
            const turn = nextState.turn === 'B' ? 'W' : 'B';
            const gameEnding = endGame.isGameFinished(nextProps.pieces, turn, threateningData);
            const newState = Object.assign(
                {},
                { shouldTestGameEnded: false },
                gameEnding
            );
            this.setState(newState);
        }
    }

    componentDidMount() {
        const boardSize = this.els.board.clientWidth;
        const tileSize = boardSize / 8;
        this.setState({
            boardSize,
            tileSize
        });
    }

    handleResize(size) {
        const tileSize = size.width / 8;
        this.setState({
            boardSize: size.width,
            tileSize
        });
    }

    coordsToPosition(coords) {
        const x = Math.round(coords.x / this.state.tileSize);
        const y = Math.round(coords.y / this.state.tileSize);
        return {
            x,
            y,
            pos: `${String.fromCharCode(decode.charCodeOffset + x)}${8 - y}`
        };
    }

    handleDrag(evt, drag) {
        if (!this.props.highlightTarget) {
            return;
        }

        const {
            targetTile
        } = this.state;
        const {
            x,
            y
        } = this.coordsToPosition({
            x: drag.node.offsetLeft + drag.x,
            y: drag.node.offsetTop + drag.y
        });

        if (!targetTile || targetTile.x !== x || targetTile.y !== y) {
            this.setState({
                targetTile: {
                    x,
                    y
                }
            });
        }
    }

    handleDragStart(evt, drag) {
        evt.preventDefault();

        if (!this.props.allowMoves || !this.state.allowMoves) {
            return false;
        }

        const node = drag.node;
        const dragFrom = this.coordsToPosition({
            x: node.offsetLeft,
            y: node.offsetTop
        });
        const draggingPiece = general.findPieceAtPosition(this.props.pieces, dragFrom.pos);

        if (draggingPiece) {
            this.showAllowedMovementsByPiece(draggingPiece);

            if (general.isPieceTurn(draggingPiece.name, this.state.turn)) {
                if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
                    return false;
                }

                this.setState({
                    dragFrom,
                    draggingPiece
                });
            } else {
                this.setState({
                    draggingPiece
                });
            }
        }

        return evt;
    }

    showAllowedMovementsByPiece(piece) {
        const {
            turn,
            enemysPossibleMov,
            threateningPos
        } = this.state;
        if (general.isPieceTurn(piece.name, turn)) {
            const result = predictions.getOptionsByName(this.props.pieces, piece, enemysPossibleMov, threateningPos);

            if (result) {
                const movs = [];
                const attacks = [];

                for (const nextMov of result.nextMovements) {
                    const check = predictions.willTheKingBeThreating(this.props.pieces, piece, nextMov);
                    if (!check || !check.isKingThreatened) {
                        movs.push(nextMov);
                    }
                }

                for (const attack of result.attacks) {
                    const check = predictions.willTheKingBeThreating(this.props.pieces, piece, attack);
                    if (!check || !check.isKingThreatened) {
                        attacks.push(attack);
                    }
                }

                result.nextMovements = movs;
                result.attacks = attacks;
                this.setState(result);
            }
        }
    }

    handleDragStop(evt, drag) {
        const node = drag.node;
        const {
            dragFrom,
            draggingPiece,
            nextMovements,
            attacks,
            turn
        } = this.state;
        const {
            pieces
        } = this.props;

        if (draggingPiece && general.isPieceTurn(draggingPiece.name, turn)) {
            const dragTo = this.coordsToPosition({
                x: node.offsetLeft + drag.x,
                y: node.offsetTop + drag.y
            });

            this.setState({
                dragFrom: null,
                targetTile: null,
                draggingPiece: null,
                nextMovements: [],
                attacks: []
            });

            if (dragFrom.pos !== dragTo.pos && !general.isSameTeamPiece(pieces, draggingPiece, dragTo.pos)) {
                const movFound = general.isMovementValid(nextMovements, attacks, dragTo);
                if (movFound) {
                    const decoded = decode.fromPieceDecl(draggingPiece.notation);
                    const qntPlayed = decoded.qntPlayed + 1;
                    const newTurn = turn === 'B' ? 'W' : 'B';

                    if (general.hasPawnPieceChange(draggingPiece.name, dragTo)) {
                        this.setState({
                            isPawnChoosing: true,
                            allowMoves: false,
                            draggingPiece,
                            dragTo,
                            qntPlayed
                        });
                    }

                    this.props.onMovePiece(draggingPiece, dragFrom.pos, dragTo.pos, qntPlayed, movFound.rookPos);
                    this.setState({
                        turn: newTurn,
                        isPawChoseNewPiece: true
                    });

                    return false;
                }
            }
        } else {
            this.setState({
                draggingPiece: null,
                nextMovements: [],
                attacks: [],
            });
        }

        return true;
    }

    selectPawNewPiece(event, newPiece) {
        event.preventDefault();
        const {
            dragTo,
            draggingPiece,
            qntPlayed
        } = this.state;

        let newPieceName;
        if (draggingPiece.name === draggingPiece.name.toLowerCase()) {
            newPieceName = newPiece.toLowerCase();
        } else {
            newPieceName = newPiece.toUpperCase();
        }

        this.props.onPawChooseNewPiece(draggingPiece.notation, `${draggingPiece.name}-${qntPlayed}@${dragTo.pos}`, newPieceName);
        this.setState({
            isPawnChoosing: false,
            allowMoves: true,
            dragTo: null,
            draggingPiece: null,
            qntPlayed: null,
            isPawChoseNewPiece: true
        });
    }

    render() {
        const {
            targetTile,
            boardSize,
            isPawnChoosing,
            isCheckmate,
            isStalemate,
            isImpossibleCheckmate,
            turn,
            nextMovements
        } = this.state;
        const {
            lightSquareColor,
            darkSquareColor,
            drawLabels
        } = this.props;
        const newBoardStyles = Object.assign({}, boardStyles, { height: boardSize });
        const tiles = board.createTiles(targetTile, lightSquareColor, darkSquareColor, drawLabels, nextMovements);
        const boardPieces = board.addPieces(this.props, this.state, this.handleDragStart, this.handleDrag, this.handleDragStop);
        let content = tiles.concat(boardPieces);

        if(isPawnChoosing){
            content = <PawnChoice selectPawNewPiece={this.selectPawNewPiece}>{content}</PawnChoice>;
        }else if(isCheckmate || isStalemate || isImpossibleCheckmate){
            content = <EndOfGame isCheckmate={isCheckmate} isStalemate={isStalemate} isImpossibleCheckmate={isImpossibleCheckmate} turn={turn}>{content}</EndOfGame>;
        }

        return (
            <ResizeAware ref={ this.setBoardRef } onlyEvent onResize={ this.handleResize } style={ newBoardStyles }>
                {content}
            </ResizeAware>
        );
    }
};

Chess.propTypes = {
    whiteStarts: PropTypes.bool,
    allowMoves: PropTypes.bool,
    highlightTarget: PropTypes.bool,
    drawLabels: PropTypes.bool,
    lightSquareColor: PropTypes.string,
    darkSquareColor: PropTypes.string,
    onMovePiece: PropTypes.func,
    onDragStart: PropTypes.func,
    onPawChooseNewPiece: PropTypes.func,
    pieces: PropTypes.arrayOf(PropTypes.string)
};

Chess.defaultProps = {
    whiteStarts: true,
    allowMoves: true,
    highlightTarget: true,
    drawLabels: true,
    onMovePiece: noop,
    onDragStart: noop,
    onPawChooseNewPiece: noop,
    lightSquareColor: '#f0d9b5',
    darkSquareColor: '#b58863',
    pieces: getDefaultLineup()
};

Chess.getDefaultLineup = getDefaultLineup;
module.exports = Chess;
