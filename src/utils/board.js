const React = require('react')
const Draggable = require('react-draggable')
const decode = require('../decode')
const pieceComponents = require('../pieces')

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

const yLabelStyles = Object.assign({}, {
    top: '5%',
    left: '5%'
}, labelStyles)

const xLabelStyles = Object.assign({}, {
    bottom: '5%',
    right: '5%'
}, labelStyles)

const possibleMoviments = {
    width: '40px',
    height: '40px',
    backgroundColor: '#208530',
    borderRadius: '50%',
    position: 'absolute',
    left: '35%',
    top: '35%',
    opacity: .3,
}

const getSquareColor = (x, y, lightSquareColor, darkSquareColor) => {
    const odd = x % 2
    if (y % 2) {
        return odd ? lightSquareColor : darkSquareColor
    }

    return odd ? darkSquareColor : lightSquareColor
}

const renderLabelText = (x, y, drawLabels) => {
    const isLeftColumn = x === 0
    const isBottomRow = y === 7

    if (!drawLabels || (!isLeftColumn && !isBottomRow)) {
        return null
    }

    if (isLeftColumn && isBottomRow) {
        return [
            <span key="blx" style={ xLabelStyles }>a</span>,
            <span key="bly" style={ yLabelStyles }>1</span>
        ]
    }

    const label = isLeftColumn ? 8 - y : String.fromCharCode(decode.charCodeOffset + x)
    return <span style={ isLeftColumn ? yLabelStyles : xLabelStyles }>{ label }</span>
}

const renderNextMovements = (x, y, nextMovements) => {
    const foundMovement = nextMovements && nextMovements.find(item => item.x === x && item.y === (7 - y))
    if (foundMovement) {
        return <div style={possibleMoviments}></div>
    }
    return null
}

const createTiles = (targetTile, lightSquareColor, darkSquareColor, drawLabels, nextMovements) => {
    const tiles = []
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const isTarget = targetTile && targetTile.x === x && targetTile.y === y
            const background = getSquareColor(x, y, lightSquareColor, darkSquareColor)
            const boxShadow = isTarget ? 'inset 0px 0px 0px 0.4vmin yellow' : undefined
            const styles = Object.assign({}, {
                background,
                boxShadow
            }, squareStyles)

            tiles.push(
                <div key={ `rect-${x}-${y}` } style={ styles }>
                  { renderLabelText(x, y, drawLabels) }
                  { renderNextMovements(x, y, nextMovements) }
                </div>
            )
        }
    }

    return tiles
}

const getAttackedPiece = (Piece, isMoving, x, y, state) => {
    const { attacks , isKingThreatened, threatenedKingPos} = state
    const attackFound = attacks.find(attack => attack && attack.x === x && attack.y === y)
    if (attackFound) {
        return (<Piece isMoving={ isMoving } x={ x } y={ y } style={{ opacity:0.3}}/>)
    } else if (isKingThreatened && threatenedKingPos.x === x && threatenedKingPos.y === y ){
        return (<Piece isMoving={ isMoving } x={ x } y={ y } threatened={true}/>)
    }

    return (<Piece isMoving={ isMoving } x={ x } y={ y } />)
}

const addPieces = (props, state, handleDragStart, handleDrag, handleDragStop) => {
    const { draggingPiece } = state
    const boardPieces = props.pieces.map( decl => {
        const isMoving = draggingPiece && draggingPiece.notation === decl
        const {x, y, piece} = decode.fromPieceDecl(decl)
        const Piece = pieceComponents[piece]
        return (
            <Draggable bounds="parent" position={ { x: 0, y: 0 } } onStart={ handleDragStart } onDrag={ handleDrag } onStop={ handleDragStop } key={ `${piece}-${x}-${y}` }>
              { getAttackedPiece(Piece, isMoving, x, y, state) }
            </Draggable>
        )
    })

    return boardPieces
}

module.exports = {
    createTiles,
    addPieces,
}
