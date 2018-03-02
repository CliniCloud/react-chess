/* eslint-disable react/display-name, react/prop-types */
const React = require('react')

module.exports = Piece => props => {
    const {onMouseDown, onMouseUp, onTouchEnd, onTouchStart, style, isMoving, fill, x, menu, threatened} = props
    const y = 7 - props.y
    let styles

    if (!menu) {
        styles = Object.assign({}, style, {
            position: 'absolute',
            left: `${x * 12.5}%`,
            top: `${y * 12.5}%`,
            width: '12.5%',
            height: '12.5%',
            textAlign: 'center',
            zIndex: isMoving ? 1000 : undefined
        })

        if(threatened){
            styles.boxShadow =  'inset 0 0 80px 8px #d85000'
        }
    } else {
        styles = {
            display: 'flex',
            justifyContent: 'center'
        }
    }

    return (
        <div onMouseDown={ onMouseDown } onMouseUp={ onMouseUp } onTouchEnd={ onTouchEnd } onTouchStart={ onTouchStart } style={ styles }>
          { (fill && <Piece size="85%" fill={ fill } />) || <Piece size="85%" /> }
        </div>
    )


}
