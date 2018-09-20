/* eslint-disable react/display-name, react/prop-types */
const React = require('react')

module.exports = Piece => props => {
    const {onMouseDown, onMouseUp, onTouchEnd, onTouchStart, style, isMoving, fill, x, menu, threatened} = props
    const y = 7 - props.y
    let styles

    if (menu) {
        styles = {
            display: 'flex',
            justifyContent: 'center'
        }
    } else {
        styles = Object.assign({}, style, {
            position: 'absolute',
            left: `${x * 12.5}%`,
            top: `${y * 12.5}%`,
            width: '12.5%',
            height: '12.5%',
            textAlign: 'center',
            zIndex: isMoving ? 1000 : undefined,
            boxShadow: threatened ? 'inset 0 0 80px 8px #d85000' : undefined
        })
    }

    if (fill) {
        return (
            <div onMouseDown={ onMouseDown } onMouseUp={ onMouseUp } onTouchEnd={ onTouchEnd } onTouchStart={ onTouchStart } style={ styles }>
              <Piece size="85%" fill={ fill } />
            </div>
        )
    }

    return (
        <div onMouseDown={ onMouseDown } onMouseUp={ onMouseUp } onTouchEnd={ onTouchEnd } onTouchStart={ onTouchStart } style={ styles }>
            <Piece size="85%" />
        </div>
    )
}
