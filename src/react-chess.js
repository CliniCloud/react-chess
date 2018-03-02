const React = require('react')
const PropTypes = require('prop-types')
const Draggable = require('react-draggable')
const resizeAware = require('react-resize-aware')
const defaultLineup = require('./defaultLineup')
const pieceComponents = require('./pieces')
const decode = require('./decode')
const utils = require('./utils/general')

require('./css/layout/movements.css')

const ResizeAware = resizeAware.default || resizeAware
const getDefaultLineup = () => defaultLineup.slice()
const noop = () => {
    /* intentional noop */
}

const square = 100 / 8
const squareSize = `${square}%`

const squareStyles = {
    width: squareSize,
    paddingBottom: squareSize,
    float: 'left',
    position: 'relative',
    pointerEvents: 'none'
}

const labelStyles = {
    fontSize: 'calc(7px + .5vw)',
    position: 'absolute',
    userSelect: 'none'
}
const yLabelStyles = Object.assign({
    top: '5%',
    left: '5%'
}, labelStyles)
const xLabelStyles = Object.assign({
    bottom: '5%',
    right: '5%'
}, labelStyles)

class Chess extends React.Component {
    constructor(...args) {
        super(...args)
        
        this.els = {}
        this.state = {
            turn : args[0].whiteStarts ? 'W' : 'B',
            attacks:[],
            nextMovements:[],
            isPawnChoosing:false,
            allowMoves:true
        }
        this.setBoardRef = el => (this.els.board = el)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.getPawnChoosing = this.getPawnChoosing.bind(this)
        this.selectPawNewPiece = this.selectPawNewPiece.bind(this)
        this.didGameEnd = this.didGameEnd.bind(this)
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState.isPawChoseNewPiece){
            const enemyThreathing = utils.isEnemyThreateningKing(nextProps.pieces, nextState.turn)
            this.setState(Object.assign({isPawChoseNewPiece:false}, enemyThreathing))
        }
    }

    getSquareColor(x, y) {
        const {lightSquareColor, darkSquareColor} = this.props
        const odd = x % 2

        if (y % 2) {
            return odd ? lightSquareColor : darkSquareColor
        }

        return odd ? darkSquareColor : lightSquareColor
    }

    componentDidMount() {
        const boardSize = this.els.board.clientWidth
        const tileSize = boardSize / 8
        this.setState({
            boardSize,
            tileSize
        })
    }

    handleResize(size) {
        const tileSize = size.width / 8
        this.setState({
            boardSize: size.width,
            tileSize
        })
    }

    coordsToPosition(coords) {
        const x = Math.round(coords.x / this.state.tileSize)
        const y = Math.round(coords.y / this.state.tileSize)
        return {
            x,
            y,
            pos: `${String.fromCharCode(decode.charCodeOffset + x)}${8 - y}`
        }
    }

    handleDrag(evt, drag) {
        if (!this.props.highlightTarget) {
            return
        }

        const {targetTile} = this.state
        const {x, y} = this.coordsToPosition({
            x: drag.node.offsetLeft + drag.x,
            y: drag.node.offsetTop + drag.y
        })

        if (!targetTile || targetTile.x !== x || targetTile.y !== y) {
            this.setState({
                targetTile: {
                    x,
                    y
                }
            })
        }
    }

    handleDragStart(evt, drag) {
        evt.preventDefault()

        if (!this.props.allowMoves || !this.state.allowMoves) {
            return false
        }

        const node = drag.node
        const dragFrom = this.coordsToPosition({
            x: node.offsetLeft,
            y: node.offsetTop
        })
        
        const draggingPiece = utils.findPieceAtPosition(this.props.pieces, dragFrom.pos)

        this.showAllowdMovementsByPiece(draggingPiece)

        if(utils.isPieceTurn(draggingPiece.name, this.state.turn)){
            if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
                return false
            }
    
            this.setState({
                dragFrom,
                draggingPiece
            })
            return evt
        }else{
            this.setState({
                draggingPiece
            })
        }
    }

    handleDragStop(evt, drag) {
        const node = drag.node
        const { dragFrom, draggingPiece, nextMovements, attacks, turn} = this.state
        const { pieces } = this.props

        if(utils.isPieceTurn(draggingPiece.name, turn)){
            const dragTo = this.coordsToPosition({
                x: node.offsetLeft + drag.x,
                y: node.offsetTop + drag.y
            })
    
            this.setState({
                dragFrom: null,
                targetTile: null,
                draggingPiece: null,
                nextMovements: [],
                attacks: []
            })

            if (dragFrom.pos !== dragTo.pos && !utils.isSameTeamPiece(pieces, draggingPiece, dragTo.pos) && 
                utils.isValidMovement(nextMovements, attacks, dragTo)) {

                    const decoded = decode.fromPieceDecl(draggingPiece.notation)
                    const qntPlayed = decoded.qntPlayed + 1
                    const newTurn = turn === 'B' ? 'W' : 'B'

                    if(utils.hasPawnPieceChange(draggingPiece.name, dragTo)){
                        this.setState({isPawnChoosing: true, allowMoves:false, draggingPiece, dragTo, qntPlayed})
                    }

                    this.props.onMovePiece(draggingPiece, dragFrom.pos, dragTo.pos, qntPlayed )
                    
                    this.setState({
                        turn: newTurn,
                        isPawChoseNewPiece:true
                    })
                    
                    return false
            }
        }else{
            this.setState({
                draggingPiece: null,
                nextMovements: [],
                attacks: [],
            })
        }

        return true
    }

    showAllowdMovementsByPiece(piece) {
        const { turn, enemysPossibleMov, threateningPos } = this.state
        if(utils.isPieceTurn(piece.name, turn)){
            const result = utils.getOptionsByName(this.props.pieces, piece, enemysPossibleMov, threateningPos)

            if(result){
                this.setState(result)
            }
        }
    }

    selectPawNewPiece(event, newPiece){
        event.preventDefault()
        const {dragTo, draggingPiece, qntPlayed, turn} = this.state

        let newPieceName
        if(draggingPiece.name === draggingPiece.name.toLowerCase()){
            newPieceName = newPiece.toLowerCase()
        }else{
            newPieceName = newPiece.toUpperCase()
        }

        this.props.onPawChooseNewPiece(draggingPiece.notation,`${draggingPiece.name}-${qntPlayed}@${dragTo.pos}`, newPieceName)
        this.setState({
            isPawnChoosing: false, 
            allowMoves:true,
            dragTo: null,
            draggingPiece:null,
            qntPlayed:null,
            isPawChoseNewPiece:true
        })
    }

    renderLabelText(x, y) {
        const isLeftColumn = x === 0
        const isBottomRow = y === 7

        if (!this.props.drawLabels || (!isLeftColumn && !isBottomRow)) {
            return null
        }

        if (isLeftColumn && isBottomRow) {
            return [
                <span key="blx" style={ xLabelStyles }>
                    a
                </span>,
                <span key="bly" style={ yLabelStyles }>
                    1
                </span>
            ]
        }

        const label = isLeftColumn ? 8 - y : String.fromCharCode(decode.charCodeOffset + x)
        return <span style={ isLeftColumn ? yLabelStyles : xLabelStyles }>{ label }</span>
    }

    renderNextMovements(x, y) {
        const { nextMovements } = this.state
        if(nextMovements){
            for(const item of nextMovements){
                if(item.x === x && item.y === (7 - y) ){
                    return <div className="possible-moviments"></div>
                }
            }
        }
        return null
    }

    getAttackedPiece(Piece, isMoving, x, y) {
        const { attacks , isKingThreatened, threatenedKingPos} = this.state
        if (attacks && attacks.length) {
            for (const attack of attacks) {
                if (attack && attack.x === x && attack.y === y) {
                    return (<Piece isMoving={ isMoving } x={ x } y={ y } style={{ opacity:0.3}}/>)
                }
            }
        }else if (isKingThreatened && threatenedKingPos.x === x && threatenedKingPos.y === y ){
            return (<Piece isMoving={ isMoving } x={ x } y={ y } threatened={true}/>)
        }

        return (<Piece isMoving={ isMoving } x={ x } y={ y } />)

    }

    getPawnChoosing(children){
        const Queen = pieceComponents['Q']
        const Bishop = pieceComponents['B']
        const Knight = pieceComponents['N']
        const Rook = pieceComponents['R']

        return (
            <div>
                <div style={{opacity:'0.2'}}>
                    { children }
                </div>
                <div className="piece-chooser">
                    <a href="/" className="link-piece-chooser" onClick={e => this.selectPawNewPiece(e, 'Q')}>
                        <Queen menu={true}/>
                    </a>
                    <a href="/" className="link-piece-chooser" onClick={e => this.selectPawNewPiece(e, 'N')}>
                        <Knight menu={true}/>
                    </a>
                    <a href="/" className="link-piece-chooser" onClick={e => this.selectPawNewPiece(e, 'R')}>
                        <Rook menu={true}/>
                    </a>
                    <a href="/" className="link-piece-chooser" onClick={e => this.selectPawNewPiece(e, 'B')}>
                        <Bishop menu={true}/>
                    </a>
                </div>
            </div>)
    }

    didGameEnd(){
        const { attacks , isKingThreatened, turn } = this.state

        if(isKingThreatened){

        }
    }

    render() {
        const {targetTile, draggingPiece, boardSize, isPawnChoosing} = this.state

        const tiles = []
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const isTarget = targetTile && targetTile.x === x && targetTile.y === y
                const background = this.getSquareColor(x, y)
                const boxShadow = isTarget ? 'inset 0px 0px 0px 0.4vmin yellow' : undefined
                const styles = Object.assign({
                    background,
                    boxShadow
                }, squareStyles)

                tiles.push(
                    <div key={ `rect-${x}-${y}` } style={ styles }>
                      { this.renderLabelText(x, y) }
                      { this.renderNextMovements(x, y) }
                    </div>
                )
            }
        }
        const pieces = this.props.pieces.map((decl, i) => {
            const isMoving = draggingPiece && i === draggingPiece.index
            const {x, y, piece} = decode.fromPieceDecl(decl)
            const Piece = pieceComponents[piece]
            return (
                <Draggable bounds="parent" position={ { x: 0, y: 0 } } onStart={ this.handleDragStart } onDrag={ this.handleDrag } onStop={ this.handleDragStop } key={ `${piece}-${x}-${y}` }>
                  { this.getAttackedPiece(Piece, isMoving, x, y) }
                </Draggable>
            )
        })

        const children = tiles.concat(pieces)
        const boardStyles = {
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: boardSize
        }

        return (
            <ResizeAware ref={ this.setBoardRef } onlyEvent onResize={ this.handleResize } style={ boardStyles }>
                {(!isPawnChoosing && children) || this.getPawnChoosing(children)}
            </ResizeAware>
        )
    }
}

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
}

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
}

Chess.getDefaultLineup = getDefaultLineup

module.exports = Chess
