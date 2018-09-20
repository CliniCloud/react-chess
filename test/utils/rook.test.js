const rook = require('../../src/utils/rook')
const decode = require('../../src/decode')
const mockedData = require('./rookMockData')


describe('Rook', () => {
    let endDir = {}

    describe("getAttacktNextMov", () => {
        beforeEach(() => {
            endDir = {
                left: false,
                right: false,
                top: false,
                down: false
            }
        })

        test("should returns one down attack", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 2
            piece.col = 2
            piece.side = 'down'
            const result = rook.getAttacktNextMov(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneDownAttack)
        })

        test("should returns one right attack", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 5
            piece.col = 4
            piece.side = 'right'
            const result = rook.getAttacktNextMov(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneRightAttack)
        })

        test("should returns one left attack", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 5
            piece.col = 0
            piece.side = 'left'
            const result = rook.getAttacktNextMov(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneLeftAttack)
        })

        test("should returns one top attack", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 7
            piece.col = 2
            piece.side = 'top'
            const result = rook.getAttacktNextMov(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneTopAttack)
        })

        test("should returns one down movement", () => {
            const piece = decode.fromPieceDecl(mockedData.movementLineUp[1])
            piece.row = 2
            piece.col = 2
            piece.side = 'down'
            const result = rook.getAttacktNextMov(mockedData.movementLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneDownMovement)
        })

        test("should returns one right movement", () => {
            const piece = decode.fromPieceDecl(mockedData.movementLineUp[1])
            piece.row = 5
            piece.col = 4
            piece.side = 'right'
            const result = rook.getAttacktNextMov(mockedData.movementLineUp, piece, endDir)

            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneRightMovement)
        })

        test("should returns one left movement", () => {
            const piece = decode.fromPieceDecl(mockedData.movementLineUp[1])
            piece.row = 5
            piece.col = 0
            piece.side = 'left'
            const result = rook.getAttacktNextMov(mockedData.movementLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneLeftMovement)
        })

        test("should returns one top movement", () => {
            const piece = decode.fromPieceDecl(mockedData.movementLineUp[1])
            piece.row = 7
            piece.col = 2
            piece.side = 'top'
            const result = rook.getAttacktNextMov(mockedData.movementLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneTopMovement)
        })

        test("should not returns any movement or attack", () => {
            const piece = decode.fromPieceDecl(mockedData.lineupNomovementAttack[1])
            piece.row = 7
            piece.col = 2
            piece.side = 'top'
            const result = rook.getAttacktNextMov(mockedData.lineupNomovementAttack, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.noAttackAndMove)
        })

        test("should not returns any movement or attack for a invalid column", () => {
            const piece = decode.fromPieceDecl(mockedData.movementLineUp[1])
            piece.row = 7
            piece.col = 9
            piece.side = 'top'
            const result = rook.getAttacktNextMov(mockedData.movementLineUp, piece, endDir)
            expect(result).toBeNull()
        })
    })

    describe("Validate utils functions", () => {
        test("should returns true when position col is the same of position x ", () => {
            const position = {
                x: 1,
                col: 1
            }
            expect(rook.isValidPosition(position)).toBe(true)
        })

        test("should returns true when position row is the same of position y ", () => {
            const position = {
                y: 3,
                row: 3
            }
            expect(rook.isValidPosition(position)).toBe(true)
        })

        test("should returns false when position col is diff of x and row is diff of y  ", () => {
            const position = {
                y: 3,
                row: 4,
                x: 1,
                col: 4
            }
            expect(rook.isValidPosition(position)).toBe(false)
        })

        test("test if it is a valid left position", () => {
            const position = {
                side: 'left',
                col: 2,
                x: 3
            }

            expect(rook.isLeftPosition(position, {
                left: false
            })).toBe(true)
            expect(rook.isLeftPosition(position, {
                left: true
            })).toBe(false)
        })

        test("test if it is a valid right position", () => {
            const position = {
                side: 'right',
                col: 4,
                x: 3
            }

            expect(rook.isRightPosition(position, {
                right: false
            })).toBe(true)
            expect(rook.isRightPosition(position, {
                right: true
            })).toBe(false)
        })

        test("test if it is a valid top position", () => {
            const position = {
                side: 'top',
                row: 4,
                y: 3
            }

            expect(rook.isUpPosition(position, {
                top: false
            })).toBe(true)
            expect(rook.isUpPosition(position, {
                top: true
            })).toBe(false)
        })

        test("test if it is a valid down position", () => {
            const position = {
                side: 'down',
                row: 4,
                y: 5
            }

            expect(rook.isDownPosition(position, {
                down: false
            })).toBe(true)
            expect(rook.isDownPosition(position, {
                down: true
            })).toBe(false)
        })
    })

    describe("generateRookPos", () => {
        beforeEach(() => {
            endDir = {
                left: false,
                right: false,
                top: false,
                down: false
            }
        })

        test("should return attacks and movs for the down", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 2
            piece.col = 2
            piece.side = 'down'
            const result = rook.generateRookPos(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneDownAttack)
        })

        test("should return attacks and movs for the right", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 5
            piece.col = 4
            piece.side = 'right'
            const result = rook.generateRookPos(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneRightAttack)
        })

        test("should return attacks and movs for the left", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 5
            piece.col = 0
            piece.side = 'left'
            const result = rook.generateRookPos(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneLeftAttack)
        })

        test("should return attacks and movs for the top", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            piece.row = 7
            piece.col = 2
            piece.side = 'top'
            const result = rook.getAttacktNextMov(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.oneTopAttack)
        })
    })

    describe("Test positions creation by side", () => {
        beforeEach(() => {
            endDir = {
                left: false,
                right: false,
                top: false,
                down: false
            }
        })

        test("should return all left moves and attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            const result = rook.getLeftPosition(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(1)
            expect(result.movs).toHaveLength(1)
            expect(result).toEqual(mockedData.leftMovsAttacks)
        })

        test("should return all right moves and attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            const result = rook.getRightPosition(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(1)
            expect(result.movs).toHaveLength(1)
            expect(result).toEqual(mockedData.rightMovsAttacks)
        })

        test("should return all down moves and attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            const result = rook.getDownPosition(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(1)
            expect(result.movs).toHaveLength(2)
            expect(result).toEqual(mockedData.downMovsAttacks)
        })

        test("should return all top moves and attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            const result = rook.getUpPosition(mockedData.defaultLineUp, piece, endDir)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(1)
            expect(result.movs).toHaveLength(1)
            expect(result).toEqual(mockedData.topMovsAttacks)
        })
    })

    describe("getOptions", () => {
        test("should generate five moves and four attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            const result = rook.getOptions(mockedData.defaultLineUp, piece)
            expect(result).not.toBeNull()
            expect(result.nextMovements).toHaveLength(5)
            expect(result.attacks).toHaveLength(4)
            expect(result).toEqual(mockedData.fiveMovesFourAttacks)
        })

        test("should generate five moves and one attack", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultLineUp[1])
            const result = rook.getOptions(mockedData.defaultLineUp, piece, mockedData.defaultLineUp[2])
            expect(result).not.toBeNull()
            expect(result.nextMovements).toHaveLength(5)
            expect(result.attacks).toHaveLength(1)
            expect(result).toEqual(mockedData.fiveMovesOneAttack)
        })

        test("should generate one move and no attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.getOptions1Mov[1])
            const result = rook.getOptions(mockedData.getOptions1Mov, piece)
            expect(result).not.toBeNull()
            expect(result.nextMovements).toHaveLength(1)
            expect(result.attacks).toHaveLength(0)
            expect(result).toEqual(mockedData.oneMovesNoAttack)
        })

        test("should generate three moves and no attacks", () => {
            const piece = decode.fromPieceDecl(mockedData.getOptions3Mov[1])
            const result = rook.getOptions(mockedData.getOptions3Mov, piece)
            expect(result).not.toBeNull()
            expect(result.nextMovements).toHaveLength(3)
            expect(result.attacks).toHaveLength(0)
            expect(result).toEqual(mockedData.threeMovesNoAttack)
        })
    })
})