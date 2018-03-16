const React = require('react')
const PropTypes = require('prop-types')
const Draggable = require('react-draggable')
const resizeAware = require('react-resize-aware')
const defaultLineup = require('./defaultLineup')
const pieceComponents = require('./pieces')
const general = require('./utils/general')
const decode = require('./decode')
const predictions = require('./utils/predictions')
const endGame = require('./utils/endGame')

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
            allowMoves:true,
            isCheckmate:false,
            isStalemate:false,
            shouldTestGameEnded:false
        }
        this.setBoardRef = el => (this.els.board = el)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.selectPawNewPiece = this.selectPawNewPiece.bind(this)
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState.isPawChoseNewPiece){
            const enemyThreathing = predictions.isEnemyThreateningKing(nextProps.pieces, nextState.turn)
            this.setState(Object.assign({isPawChoseNewPiece:false, shouldTestGameEnded:true}, enemyThreathing))
        }else if(nextProps.pieces !== this.props.pieces){
            this.setState(endGame.isGameFinished(nextProps.pieces, nextState.turn))
        }else if(nextState.shouldTestGameEnded){
            const check = {
                isKingThreatened:nextState.isKingThreatened, 
                threateningPos:nextState.threateningPos
            }

            const newState = Object.assign( 
                { shouldTestGameEnded:false },
                endGame.isGameFinished(nextProps.pieces, nextState.turn === 'B' ? 'W' : 'B', check)
            )
            this.setState(newState)
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
        
        const draggingPiece = general.findPieceAtPosition(this.props.pieces, dragFrom.pos)

        if(draggingPiece){
            this.showAllowdMovementsByPiece(draggingPiece)
    
            if(general.isPieceTurn(draggingPiece.name, this.state.turn)){
                if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
                    return false
                }
        
                this.setState({
                    dragFrom,
                    draggingPiece
                })
            }else{
                this.setState({
                    draggingPiece
                })
            }
        }

        return evt
    }

    handleDragStop(evt, drag) {
        const node = drag.node
        const { dragFrom, draggingPiece, nextMovements, attacks, turn} = this.state
        const { pieces } = this.props

        if(draggingPiece && general.isPieceTurn(draggingPiece.name, turn)){
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
            
            if (dragFrom.pos !== dragTo.pos && !general.isSameTeamPiece(pieces, draggingPiece, dragTo.pos)) {
                const movFound = general.isValidMovement(nextMovements, attacks, dragTo)
                if(movFound){
                    const decoded = decode.fromPieceDecl(draggingPiece.notation)
                    const qntPlayed = decoded.qntPlayed + 1
                    const newTurn = turn === 'B' ? 'W' : 'B'

                    if(general.hasPawnPieceChange(draggingPiece.name, dragTo)){
                        this.setState({isPawnChoosing: true, allowMoves:false, draggingPiece, dragTo, qntPlayed})
                    }

                    this.props.onMovePiece(draggingPiece, dragFrom.pos, dragTo.pos, qntPlayed, movFound.rookPos )
                    
                    this.setState({
                        turn: newTurn,
                        isPawChoseNewPiece:true
                    })
                    
                    return false
                }
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
        if(general.isPieceTurn(piece.name, turn)){
            const result = predictions.getOptionsByName(this.props.pieces, piece, enemysPossibleMov, threateningPos)
            if(result){
                const movs =  []
                const attacks =  []
                
                for(const nextMov of result.nextMovements){
                    const check  = predictions.willTheKingBeThreating(this.props.pieces, piece, nextMov)
                    if(!check || !check.isKingThreatened){
                        movs.push(nextMov)
                    }
                }

                for(const attack of result.attacks){
                    const check  = predictions.willTheKingBeThreating(this.props.pieces, piece, attack)
                    if(!check || !check.isKingThreatened){
                        attacks.push(attack)
                    }
                }

                result.nextMovements = movs
                result.attacks = attacks

                this.setState(result)
            }
        }
    }

    selectPawNewPiece(event, newPiece){
        event.preventDefault()
        const {dragTo, draggingPiece, qntPlayed} = this.state

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

    render() {
        const {targetTile, draggingPiece, boardSize, isPawnChoosing, isCheckmate, isStalemate, isImpossibleCheckmate, turn} = this.state

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
        const pieces = this.props.pieces.map( decl => {
            const isMoving = draggingPiece && draggingPiece.notation === decl
            const {x, y, piece} = decode.fromPieceDecl(decl)
            const Piece = pieceComponents[piece]
            return (
                <Draggable bounds="parent" position={ { x: 0, y: 0 } } onStart={ this.handleDragStart } onDrag={ this.handleDrag } onStop={ this.handleDragStop } key={ `${piece}-${x}-${y}` }>
                  { this.getAttackedPiece(Piece, isMoving, x, y) }
                </Draggable>
            )
        })

        const pawChoises = content => {
            return (<div>
                <div style={{opacity:'0.2'}}>
                    { content }
                </div>
                <div className="piece-chooser">
                    <a href="/" className="link-piece-chooser" onClick={evt => this.selectPawNewPiece(evt, 'Q')}>
                        <pieceComponents.Q menu={true}/>
                    </a>
                    <a href="/" className="link-piece-chooser" onClick={evt => this.selectPawNewPiece(evt, 'N')}>
                        <pieceComponents.N menu={true}/>
                    </a>
                    <a href="/" className="link-piece-chooser" onClick={evt => this.selectPawNewPiece(evt, 'R')}>
                        <pieceComponents.R menu={true}/>
                    </a>
                    <a href="/" className="link-piece-chooser" onClick={evt => this.selectPawNewPiece(evt, 'B')}>
                        <pieceComponents.B menu={true}/>
                    </a>
                </div>
            </div>)
        }
        
        const isEndOfGame = contentChildren => {
            const wrapperStyle = {
                display:'flex',
                justifyContent:'center',
                width: '100%',
                position: 'absolute',
                top:'45%',
                fontSize:'45px',
                color:'#0d8dcb'
            }
    
            const endOfGameWrapper = content => {
                return (
                    <div>
                    <div style={{opacity:'0.2'}}>
                        {contentChildren}
                    </div>
                    <div style={wrapperStyle}>
                        {content}
                    </div>
                </div>
                )
            }
    
            if(isCheckmate){
                return endOfGameWrapper(<h2>Checkmate from <span style={{color:turn === 'B' ? '#d8d8d8' : 'black'}}>{turn === 'B' ? 'White' : 'Black'}</span></h2>)
            }else if(isStalemate){
                return endOfGameWrapper(<h2>Stalemate from <span style={{color:turn === 'B' ? '#d8d8d8' : 'black'}}>{turn === 'B' ? 'White' : 'Black'}</span></h2>)
            }else if(isImpossibleCheckmate){
                return endOfGameWrapper(<h2>The game has finished in a draw</h2>)
            }

            return null
        }

        let content = tiles.concat(pieces)

        if(isPawnChoosing){
            content = pawChoises(content)
        }else if(isCheckmate){
            // content = this.didGameEnd(content)
            content = isEndOfGame(content)
        }else if(isStalemate){
            content = isEndOfGame(content)
        }else if(isImpossibleCheckmate){
            content = isEndOfGame(content)
        }

        const boardStyles = {
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: boardSize
        }

        return (
            <ResizeAware ref={ this.setBoardRef } onlyEvent onResize={ this.handleResize } style={ boardStyles }>
                {content}
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
