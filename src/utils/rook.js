const general = require('./general')

/**
 * Generate movement or attack for a board position
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {*} endDir flag container to check if movements for especific side finished
 */
const getAttacktNextMov = (pieces, piece, endDir) => {
    const column = general.getColumn(piece.col)
    if (column) {
        const squarePiece = general.findPieceAtPosition(pieces, `${column}${piece.row+1}`)
        if (squarePiece) {
            if (!general.isPiecesFromSameTeam(squarePiece, piece)) {
                return {
                    attack: {
                        x: piece.col,
                        y: piece.row
                    },

                    endDir: Object.assign(
                        {}, 
                        endDir, 
                        { [piece.side]: true }
                    ),
                }
            }

            return {
                endDir: Object.assign(
                    {},
                    endDir, 
                    { [piece.side]: true }
                ),
            }
        } 
        
        return {
            nextMov: {
                x: piece.col,
                y: piece.row
            },
            endDir,
        }
    }

    return null
}

/**
 * Validate x or y position are the same of the rook
 * @param {object} pos position object
 */
const isValidPosition = pos => pos.x === pos.col || pos.y === pos.row 

/**
 * Validate if x and y are inside of rook left movements and attacks
 * @param {object} pos position object
 * @param {object} endeDir flag container to check if movements for especific side finished
 */
const isLeftPosition = (pos, endeDir) => pos.side === 'left' && !endeDir.left && pos.col < pos.x

/**
 * Validate if x and y are inside of rook right movements and attacks
 * @param {object} pos position object
 * @param {object} endeDir flag container to check if movements for especific side finished
 */
const isRightPosition = (pos, endeDir) => pos.side === 'right' && !endeDir.right && pos.col > pos.x

/**
 * Validate if x and y are inside of rook up movements and attacks
 * @param {object} pos position object
 * @param {object} endeDir flag container to check if movements for especific side finished
 */
const isUpPosition = (pos, endeDir) => pos.side === 'top' && !endeDir.top && pos.row > pos.y

/**
 * Validate if x and y are inside of rook down movements and attacks
 * @param {object} pos position object
 * @param {object} endeDir flag container to check if movements for especific side finished
 */
const isDownPosition = (pos, endeDir) => pos.side === 'down' && !endeDir.down && pos.row < pos.y

/**
 * Validate if x and y belongs to any side movements and return it
 * @param {array} pieces all current pieces
 * @param {object} piece decoded piece
 * @param {object} endeDir flag container to check if movements for especific side finished
 */
const generateRookPos = (pieces, piece, endeDir) => {
    if (isValidPosition(piece)) {
        if(isLeftPosition(piece, endeDir) || isRightPosition(piece, endeDir) || isUpPosition(piece, endeDir) || isDownPosition(piece, endeDir)){
            return getAttacktNextMov(pieces, piece, endeDir)
        }
    }

    return null
}

/**
 * Get movements and attacks to left
 * @param {array} pieces all current pieces
 * @param {object} piece  decoded piece 
 * @param {object} endedDirection flag container to check if movements for especific side finished
 */
const getLeftPosition = (pieces, piece, endedDirection) => {
    let endDir = Object.assign({}, endedDirection)
    const attacks = []
    const movs = []
    const newPiece = Object.assign({}, piece, {
        side: 'left'
    })
    for (let col = newPiece.x; col > -1; col--) {
        newPiece.col = col
        for (let row = 0; row < 8; row++) {
            newPiece.row = row
            const rookResult = generateRookPos(pieces, newPiece, endDir)
            endDir = rookResult && rookResult.endDir ? rookResult.endDir : endDir
            if (rookResult && rookResult.attack) {
                attacks.push(rookResult.attack)
            } else if (rookResult && rookResult.nextMov) {
                movs.push(rookResult.nextMov)
            }
        }
    }

    return {
        endDir,
        attacks,
        movs
    }
}

/**
 * Get movements and attacks to right
 * @param {array} pieces all current pieces
 * @param {object} piece  decoded piece 
 * @param {object} endedDirection flag container to check if movements for especific side finished
 */
const getRightPosition = (pieces, piece, endedDirection) => {
    let endDir = Object.assign({}, endedDirection)
    const attacks = []
    const movs = []
    const newPiece = Object.assign({}, piece, {
        side: 'right'
    })
    for (let col = newPiece.x; col < 8; col++) {
        newPiece.col = col
        for (let row = 0; row < 8; row++) {
            newPiece.row = row
            const rookResult = generateRookPos(pieces, newPiece, endDir)
            endDir = rookResult && rookResult.endDir ? rookResult.endDir : endDir
            if (rookResult && rookResult.attack) {
                attacks.push(rookResult.attack)
            } else if (rookResult && rookResult.nextMov) {
                movs.push(rookResult.nextMov)
            }
        }
    }

    return {
        endDir,
        attacks,
        movs
    }
}

/**
 * Get movements and attacks to down
 * @param {array} pieces all current pieces
 * @param {object} piece  decoded piece 
 * @param {object} endedDirection flag container to check if movements for especific side finished
 */
const getDownPosition = (pieces, piece, endedDirection) => {
    let endDir = Object.assign({}, endedDirection)
    const attacks = []
    const movs = []
    const newPiece = Object.assign({}, piece, {
        side: 'down'
    })
    for (let col = 0; col < 8; col++) {
        newPiece.col = col
        for (let row = newPiece.y; row > -1; row--) {
            newPiece.row = row
            const rookResult = generateRookPos(pieces, newPiece, endDir)
            endDir = rookResult && rookResult.endDir ? rookResult.endDir : endDir
            if (rookResult && rookResult.attack) {
                attacks.push(rookResult.attack)
            } else if (rookResult && rookResult.nextMov) {
                movs.push(rookResult.nextMov)
            }
        }
    }

    return {
        endDir,
        attacks,
        movs
    }
}

/**
 * Get movements and attacks to up
 * @param {array} pieces all current pieces
 * @param {object} piece  decoded piece 
 * @param {object} endedDirection flag container to check if movements for especific side finished
 */
const getUpPosition =(pieces, piece, endedDirection) => {
    let endDir = Object.assign({}, endedDirection)
    const attacks = []
    const movs = []
    const newPiece = Object.assign({}, piece, {
        side: 'top'
    })
    for (let col = 0; col < 8; col++) {
        newPiece.col = col
        for (let row = newPiece.y; row < 8; row++) {
            newPiece.row = row
            const rookResult = generateRookPos(pieces, newPiece, endDir)
            endDir = rookResult && rookResult.endDir ? rookResult.endDir : endDir
            if (rookResult && rookResult.attack) {
                attacks.push(rookResult.attack)
            } else if (rookResult && rookResult.nextMov) {
                movs.push(rookResult.nextMov)
            }
        }
    }

    return {
        endDir,
        attacks,
        movs
    }
}

/**
 * Create next movements and attacks for rook when its king is threatened or not
 * @param {array} pieces all current pieces
 * @param {object} piece  decoded piece
 * @param {object} threateningPos king's threatening enemy's pos
 */
const getOptions = (pieces, piece, threateningPos) => {
    let nextMovements = []
    let attacks = []

    let endedDirection = {
        left: false,
        right: false,
        top: false,
        down: false
    }

    const leftResult = getLeftPosition(pieces, piece, endedDirection)
    if (leftResult) {
        nextMovements = nextMovements.concat(leftResult.movs)
        attacks = attacks.concat(leftResult.attacks)
        endedDirection = leftResult.endDir
    }
    
    const rightResult = getRightPosition(pieces, piece, endedDirection)
    if (rightResult) {
        nextMovements = nextMovements.concat(rightResult.movs)
        attacks = attacks.concat(rightResult.attacks)
        endedDirection = rightResult.endDir
    }
    
    const downResult = getDownPosition(pieces, piece, endedDirection)
    if (downResult) {
        nextMovements = nextMovements.concat(downResult.movs)
        attacks = attacks.concat(downResult.attacks)
        endedDirection = downResult.endDir
    }
    
    const upResult = getUpPosition(pieces, piece, endedDirection)
    if (upResult) {
        nextMovements = nextMovements.concat(upResult.movs)
        attacks = attacks.concat(upResult.attacks)
        endedDirection = upResult.endDir
    }

    const threateningAttacks = general.getThreateningAttack(attacks, threateningPos)
    if(threateningAttacks){
        attacks = threateningAttacks
    }
    
    return {
        nextMovements,
        attacks
    }
}


let API = {
    getOptions
}

if (general.isTestEnv()) {
    API = Object.assign({}, API, {
        isValidPosition,
        isLeftPosition,
        isRightPosition,
        isUpPosition,
        isDownPosition,
        generateRookPos,
        getLeftPosition,
        getRightPosition,
        getDownPosition,
        getUpPosition,
        getAttacktNextMov
    })
}

module.exports = API