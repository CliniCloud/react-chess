const pawn = require('../../src/utils/pawn')
const decode = require('../../src/decode')
const mockedData = require('./pawnMockData')

describe('Pawn', () => {
    describe('createMovAttackByPos for black pawn position', () => {
        test('should create one movement to pawn', () => {
            const piece = decode.fromPieceDecl(mockedData.defaultBlackLineUp[5])
            piece.row = piece.y - 1
            piece.lengthRows = 1
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.defaultBlackLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.nextMovement).toHaveLength(1)
            expect(result.nextMovement).toEqual(mockedData.oneMoveBlack)
        })

        test('should create two movement to pawn', () => {
            const piece = decode.fromPieceDecl(mockedData.defaultBlackLineUp[5])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.defaultBlackLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.nextMovement).toHaveLength(2)
            expect(result.nextMovement).toEqual(mockedData.twoMovesBlack)
        })

        test("should create one attack on the pawn's right", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultBlackLineUp[5])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = -1
            const result = pawn.createMovAttackByPos(mockedData.defaultBlackLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.attack).toEqual(mockedData.rightAttackBlack)
        })

        test("should create one attack on the pawn's left", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultBlackLineUp[5])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = 1
            const result = pawn.createMovAttackByPos(mockedData.defaultBlackLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.attack).toEqual(mockedData.leftAttackBlack)
        })

        test("should not create a right attack for same team pieces", () => {
            const piece = decode.fromPieceDecl(mockedData.createMovAttackByPosRightST[4])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = 1
            const result = pawn.createMovAttackByPos(mockedData.createMovAttackByPosRightST, piece, colIndex)
            expect(result).toBeNull()
        })

        test("should not create a left attack for same team pieces", () => {
            const piece = decode.fromPieceDecl(mockedData.createMovAttackByPosLeftST[4])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = -1
            const result = pawn.createMovAttackByPos(mockedData.createMovAttackByPosLeftST, piece, colIndex)
            expect(result).toBeNull()
        })

        test("should not create movement when there is a same team piece in the way", () => {
            const piece = decode.fromPieceDecl(mockedData.createMovAttackByPosSTWay[4])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.createMovAttackByPosSTWay, piece, colIndex)
            expect(result).toBeNull()
        })

        test("should not create movement when there is an enemy piece in the way", () => {
            const piece = decode.fromPieceDecl(mockedData.createMovAttackByPosEnemyWay[5])
            piece.row = piece.y - 1
            piece.lengthRows = 2
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.createMovAttackByPosEnemyWay, piece, colIndex)
            expect(result).toBeNull()
        })
    })

    describe('createMovAttackByPos for white pawn position', () => {
        test('should create one movement to pawn', () => {
            const piece = decode.fromPieceDecl(mockedData.defaultWhiteLineUp[2])
            piece.row = piece.y + 1
            piece.lengthRows = 1
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.defaultWhiteLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.nextMovement).toHaveLength(1)
            expect(result.nextMovement).toEqual(mockedData.oneMoveWhite)
        })

        test('should create two movement to pawn', () => {
            const piece = decode.fromPieceDecl(mockedData.defaultWhiteLineUp[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.defaultWhiteLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.nextMovement).toHaveLength(2)
            expect(result.nextMovement).toEqual(mockedData.twoMovesWhite)
        })

        test('should create right attack to pawn', () => {
            const piece = decode.fromPieceDecl(mockedData.defaultWhiteLineUp[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = -1
            const result = pawn.createMovAttackByPos(mockedData.defaultWhiteLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.attack).toEqual(mockedData.rightAttackWhite)
        })

        test('should create left attack to pawn', () => {
            const piece = decode.fromPieceDecl(mockedData.defaultWhiteLineUp[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = 1
            const result = pawn.createMovAttackByPos(mockedData.defaultWhiteLineUp, piece, colIndex)
            expect(result).not.toBe(null)
            expect(result.attack).toEqual(mockedData.leftAttackWhite)
        })

        test("should not create a left attack for same team pieces", () => {
            const piece = decode.fromPieceDecl(mockedData.whiteLeftAttSameTeam[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = 1
            const result = pawn.createMovAttackByPos(mockedData.whiteLeftAttSameTeam, piece, colIndex)
            expect(result).toBeNull()
        })

        test("should not create a right attack for same team pieces", () => {
            const piece = decode.fromPieceDecl(mockedData.whiteRightAttSameTeam[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = -1
            const result = pawn.createMovAttackByPos(mockedData.whiteRightAttSameTeam, piece, colIndex)
            expect(result).toBeNull()
        })

        test("should not create movement when there is a same team piece in the way", () => {
            const piece = decode.fromPieceDecl(mockedData.whiteMovSameTeamWay[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.whiteMovSameTeamWay, piece, colIndex)
            expect(result).toBeNull()
        })

        test("should not create movement when there is an enemy piece in the way", () => {
            const piece = decode.fromPieceDecl(mockedData.whiteMovEnemyWay[2])
            piece.row = piece.y + 1
            piece.lengthRows = 2
            const colIndex = 0
            const result = pawn.createMovAttackByPos(mockedData.whiteMovEnemyWay, piece, colIndex)
            expect(result).toBeNull()
        })
    })

    describe("createMovsAttacks", () => {
        test("should create two movements and two attacks for black pawn", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultBlackLineUp[5])
            const result = pawn.createMovsAttacks(mockedData.defaultBlackLineUp, piece)
            expect(result).not.toBe(null)
            expect(result.attacks).toHaveLength(2)
            expect(result.nextMovements).toHaveLength(2)
            expect(result.attacks).toEqual(mockedData.twoMovesTwoAttacksBlack.attacks)
            expect(result.nextMovements).toEqual(mockedData.twoMovesTwoAttacksBlack.movs)
        })

        test("should create one movement and one attack for black pawn", () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacks1Mov1AttBlack[4])
            const result = pawn.createMovsAttacks(mockedData.createMovsAttacks1Mov1AttBlack, piece)
            expect(result).not.toBe(null)
            expect(result.attacks).toHaveLength(1)
            expect(result.nextMovements).toHaveLength(1)
            expect(result.attacks).toEqual(mockedData.oneMoveOneAttackBlack.attacks)
            expect(result.nextMovements).toEqual(mockedData.oneMoveOneAttackBlack.movs)
        })

        test("should create two movements and two attacks for white pawn", () => {
            const piece = decode.fromPieceDecl(mockedData.defaultWhiteLineUp[2])
            const result = pawn.createMovsAttacks(mockedData.defaultWhiteLineUp, piece)
            expect(result).not.toBe(null)
            expect(result.attacks).toHaveLength(2)
            expect(result.nextMovements).toHaveLength(2)
            expect(result.attacks).toEqual(mockedData.twoMovesTwoAttacksWhite.attacks)
            expect(result.nextMovements).toEqual(mockedData.twoMovesTwoAttacksWhite.movs)
        })

        test("should create one movement and one attack for white pawn", () => {
            const piece = decode.fromPieceDecl(mockedData.create1Mov1AttWhite[2])
            const result = pawn.createMovsAttacks(mockedData.create1Mov1AttWhite, piece)
            expect(result).not.toBe(null)
            expect(result.attacks).toHaveLength(1)
            expect(result.nextMovements).toHaveLength(1)
            expect(result.attacks).toEqual(mockedData.oneMoveOneAttackWhite.attacks)
            expect(result.nextMovements).toEqual(mockedData.oneMoveOneAttackWhite.movs)
        })
    })

    describe("getOptions", () => {
        test("should create black pawn attack again king's threatening", () => {
            const piece = decode.fromPieceDecl(mockedData.getOptionsBlackPawnKingThreathening[3])
            const result = pawn.getOptions(
                mockedData.getOptionsBlackPawnKingThreathening,
                piece,
                mockedData.getOptionsBlackPawnKingThreathening[1])
            expect(result).not.toBe(null)
            expect(result.attacks).toHaveLength(1)
            expect(result.attacks).toEqual(mockedData.blackPawnAttackAgainThreatening)
        })

        test("should create white pawn attack again king's threatening", () => {
            const piece = decode.fromPieceDecl(mockedData.getOptionsWhitePawnKingThreathening[1])
            const result = pawn.getOptions(
                mockedData.getOptionsWhitePawnKingThreathening,
                piece,
                mockedData.getOptionsWhitePawnKingThreathening[3])
            expect(result).not.toBe(null)
            expect(result.attacks).toHaveLength(1)
            expect(result.attacks).toEqual(mockedData.whitePawnAttackAgainThreatening)
        })

        test("should create white pawn 1 movement and 1 attack", () => {
            const piece = decode.fromPieceDecl(mockedData.getOptionsWhitePawn1Att1Mov[1])
            const result = pawn.getOptions(
                mockedData.getOptionsWhitePawn1Att1Mov,
                piece)
                
            expect(result).not.toBe(null)
            expect(result).toEqual(mockedData.whitePawn1Att1MovResult)
        })
    })

    describe("getEnemyPawnsAttacks", () => {
        test('should return two white pawns possible attacks', () => {
            const result = pawn.getEnemyPawnsAttacks(mockedData.getEnemyPawnsAttacks2WhitePawns, 'W')
            expect(result).not.toBeNull()
            expect(result).toHaveLength(2)
            expect(result).toEqual(mockedData.twoWhitePrawnAttacks)
        })

        test('Should return four white pawns possible attacks', () => {
            const result = pawn.getEnemyPawnsAttacks(mockedData.getEnemyPawnsAttacks4WhitePawns, 'W')
            expect(result).not.toBeNull()
            expect(result).toHaveLength(4)
            expect(result).toEqual(mockedData.fourWhitePrawnAttacks)
        })

        test('Should returns two black pawns possible attacks', () => {
            const result = pawn.getEnemyPawnsAttacks(mockedData.getEnemyPawnsAttacks2BlackPawns, 'B')
            expect(result).not.toBeNull()
            expect(result).toHaveLength(2)
            expect(result).toEqual(mockedData.twoBlackPawnAttacks)
        })

        test('Should returns four black pawns possible attacks', () => {
            const result = pawn.getEnemyPawnsAttacks(mockedData.getEnemyPawnsAttacks4BlackPawns, 'B')
            expect(result).not.toBeNull()
            expect(result).toHaveLength(4)
            expect(result).toEqual(mockedData.fourBlackPawnAttacks)
        })
    })
})