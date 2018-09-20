const knight = require('../../src/utils/knight')
const decode = require('../../src/decode')
const mockedData = require('./knightMockData')


describe('knight', () => {
    describe('isRangeMatch', () => {
        test('should return true', () => {
            expect(knight.isRangeMatch(-2, -1)).toBe(true)
            expect(knight.isRangeMatch(-2, 1)).toBe(true)
            expect(knight.isRangeMatch(-1, -2)).toBe(true)
            expect(knight.isRangeMatch(-1, 2)).toBe(true)
            expect(knight.isRangeMatch(1, 2)).toBe(true)
            expect(knight.isRangeMatch(1, -2)).toBe(true)
            expect(knight.isRangeMatch(2, 1)).toBe(true)
            expect(knight.isRangeMatch(2, -1)).toBe(true)
        })

        test('should return false', () => {
            expect(knight.isRangeMatch(-2, -2)).toBe(false)
            expect(knight.isRangeMatch(-2, 2)).toBe(false)
            expect(knight.isRangeMatch(-1, -1)).toBe(false)
            expect(knight.isRangeMatch(-1, 1)).toBe(false)
            expect(knight.isRangeMatch(1, -1)).toBe(false)
            expect(knight.isRangeMatch(1, 1)).toBe(false)
            expect(knight.isRangeMatch(2, -2)).toBe(false)
            expect(knight.isRangeMatch(2, 2)).toBe(false)
        })
    })

    describe('getAttacktNextMov movements', () => {
        test('should create two left movements in extreme left', () => {
            const piece = decode.fromPieceDecl(mockedData.movementsLineUp[2])
            const xPos = piece.x - 2
            const result = knight.getAttacktNextMov(mockedData.movementsLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(2)
            expect(result).toEqual(mockedData.twoLeftMovesExtreme)
        })

        test('should create two left movements in middle left', () => {
            const piece = decode.fromPieceDecl(mockedData.movementsLineUp[2])
            const xPos = piece.x - 1
            const result = knight.getAttacktNextMov(mockedData.movementsLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(2)
            expect(result).toEqual(mockedData.twoLeftMovesMiddle)
        })

        test('should create two right movements in middle right', () => {
            const piece = decode.fromPieceDecl(mockedData.movementsLineUp[2])
            const xPos = piece.x + 1
            const result = knight.getAttacktNextMov(mockedData.movementsLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(2)
            expect(result).toEqual(mockedData.twoRightMovesMiddle)
        })

        test('should create two right movements in extreme right', () => {
            const piece = decode.fromPieceDecl(mockedData.movementsLineUp[2])
            const xPos = piece.x + 2
            const result = knight.getAttacktNextMov(mockedData.movementsLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(2)
            expect(result).toEqual(mockedData.twoRightMovesExtreme)
        })

        test('should not create any movement in the middle', () => {
            const piece = decode.fromPieceDecl(mockedData.movementsLineUp[2])
            const result = knight.getAttacktNextMov(mockedData.movementsLineUp, piece, piece.x)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(0)
        })

        test('should not create a movement in an inexistent column', () => {

            const piece = decode.fromPieceDecl(mockedData.getAttacktNextMovLineup1[2])
            const xPos = piece.x - 2
            const result = knight.getAttacktNextMov(mockedData.getAttacktNextMovLineup1, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(0)
        })

        test('should not create a movement in an inexistent up row', () => {
            const piece = decode.fromPieceDecl(mockedData.getAttacktNextMovLineup2[2])
            const xPos = piece.x - 2
            const result = knight.getAttacktNextMov(mockedData.getAttacktNextMovLineup2, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(1)
            expect(result).toEqual(mockedData.notCreateMovInexUPRow)
        })

        test('should not create a movement in an inexistent down row', () => {
            const piece = decode.fromPieceDecl(mockedData.getAttacktNextMovLineup3[2])
            const xPos = piece.x - 2
            const result = knight.getAttacktNextMov(mockedData.getAttacktNextMovLineup3, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(1)
            expect(result).toEqual(mockedData.notCreateMovInexDownRow)
        })
    })

    describe('getAttacktNextMov attacks', () => {
        test('should create two left attacks in the extreme left', () => {
            const piece = decode.fromPieceDecl(mockedData.attacksLineUp[2])
            const xPos = piece.x - 2
            const result = knight.getAttacktNextMov(mockedData.attacksLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(2)
            expect(result.nextMovements).toHaveLength(0)
            expect(result).toEqual(mockedData.twoAttacksExtremeLeft)
        })

        test('should create two left attacks in the middle left', () => {
            const piece = decode.fromPieceDecl(mockedData.attacksLineUp[2])
            const xPos = piece.x - 1
            const result = knight.getAttacktNextMov(mockedData.attacksLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(2)
            expect(result.nextMovements).toHaveLength(0)
            expect(result).toEqual(mockedData.twoAttacksMiddleLeft)
        })

        test('should create two right attacks in the middle right', () => {
            const piece = decode.fromPieceDecl(mockedData.attacksLineUp[2])
            const xPos = piece.x + 1
            const result = knight.getAttacktNextMov(mockedData.attacksLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(2)
            expect(result.nextMovements).toHaveLength(0)
            expect(result).toEqual(mockedData.twoAttacksMiddleRight)
        })

        test('should create two right attacks in the extreme right', () => {
            const piece = decode.fromPieceDecl(mockedData.attacksLineUp[2])
            const xPos = piece.x + 2
            const result = knight.getAttacktNextMov(mockedData.attacksLineUp, piece, xPos)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(2)
            expect(result.nextMovements).toHaveLength(0)
            expect(result).toEqual(mockedData.twoAttacksExtremeRight)
        })

        test('should not create any attacks in the middle', () => {
            const piece = decode.fromPieceDecl(mockedData.attacksLineUp[2])
            const result = knight.getAttacktNextMov(mockedData.attacksLineUp, piece, piece.x)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(0)
            expect(result.nextMovements).toHaveLength(0)
        })
    })

    describe('getOptions', () => {
        test('should return eight attacks and no movements', () => {
            const piece = decode.fromPieceDecl(mockedData.attacksLineUp[2])
            const result = knight.getOptions(mockedData.attacksLineUp, piece)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(8)
            expect(result.nextMovements).toHaveLength(0)
            expect(result).toEqual(mockedData.eightAttacks)
        })

        test('should return five attacks and three movements', () => {
            const piece = decode.fromPieceDecl(mockedData.getOptions5Att3Movs[2])
            const result = knight.getOptions(mockedData.getOptions5Att3Movs, piece)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(5)
            expect(result.nextMovements).toHaveLength(3)
            expect(result).toEqual(mockedData.fiveAttacksThreeMovs)
        })

        test('should return four attacks and two movements', () => {
            const piece = decode.fromPieceDecl(mockedData.getOptions4Att2Movs[2])
            const result = knight.getOptions(mockedData.getOptions4Att2Movs, piece)
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(4)
            expect(result.nextMovements).toHaveLength(2)
            expect(result).toEqual(mockedData.fourAttacksTwoMovs)
        })

        test('should return one attack to king threatening pos', () => {
            const piece = decode.fromPieceDecl(mockedData.getOptions1Att2KingThreat[2])
            const result = knight.getOptions(
                mockedData.getOptions1Att2KingThreat,
                piece,
                mockedData.getOptions1Att2KingThreat[7])
            expect(result).not.toBeNull()
            expect(result.attacks).toHaveLength(1)
            expect(result.nextMovements).toHaveLength(0)
            expect(result).toEqual(mockedData.oneAttackNoMovs)
        })
    })
})