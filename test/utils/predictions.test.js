const predictions = require('../../src/utils/predictions')
const decode = require('../../src/decode')
const predictionsMockData = require('./predictionsMockData')
const pawnMockData = require('./pawnMockData')
const bishopMockData = require('./bishopMockData')
const knightMockData = require('./knightMockData')
const rookMockData = require('./rookMockData')

describe('predictions', () => {
    describe('getOptionsByName', () => {
        test('should return pawn next movement and attack', () => {
            const piece = decode.fromPieceDecl(pawnMockData.getOptionsWhitePawn1Att1Mov[1])
            expect(predictions.getOptionsByName(pawnMockData.getOptionsWhitePawn1Att1Mov, piece))
            .toEqual(pawnMockData.whitePawn1Att1MovResult)
        })

        test('should return pawn next attack again kings threatening', () => {
            const piece = decode.fromPieceDecl(pawnMockData.getOptionsWhitePawnKingThreathening[1])
            expect(predictions.getOptionsByName(
                pawnMockData.getOptionsWhitePawnKingThreathening,
                piece,
                null,
                pawnMockData.getOptionsWhitePawnKingThreathening[3]))
            .toEqual(pawnMockData.whitePawn1Att1MovResult)
        })

        test('should return bishop three movements and one attack', () => {
            const piece = decode.fromPieceDecl(bishopMockData.oneMovLineup[1])
            expect(predictions.getOptionsByName(bishopMockData.oneMovLineup, piece))
            .toEqual(bishopMockData.threeMovOneAttResult)
        })

        test('should return bishop attack to king threatening enemy', () => {
            const piece = decode.fromPieceDecl(bishopMockData.threateningKingLineup[1])
            expect(predictions.getOptionsByName(
                bishopMockData.threateningKingLineup,
                piece,
                null,
                bishopMockData.threateningKingLineup[8]))
            .toEqual(bishopMockData.threateningKingResult)
        })

        test('should return eight knight attacks and no movements', () => {
            const piece = decode.fromPieceDecl(knightMockData.attacksLineUp[2])
            expect(predictions.getOptionsByName(knightMockData.attacksLineUp, piece))
            .toEqual(knightMockData.eightAttacks)
        })

        test('should return one knight attack to king threatening', () => {
            const piece = decode.fromPieceDecl(knightMockData.getOptions1Att2KingThreat[2])
            expect(predictions.getOptionsByName(knightMockData.getOptions1Att2KingThreat,
                piece,
                null,
                knightMockData.getOptions1Att2KingThreat[7]
            ))
            .toEqual(knightMockData.oneAttackNoMovs)
        })

        test('should return four rook attacks and five movements', () => {
            const piece = decode.fromPieceDecl(rookMockData.defaultLineUp[1])
            expect(predictions.getOptionsByName(rookMockData.defaultLineUp, piece))
            .toEqual(rookMockData.fiveMovesFourAttacks)
        })

        test('should return one rook attack and five movements', () => {
            const piece = decode.fromPieceDecl(rookMockData.defaultLineUp[1])
            expect(predictions.getOptionsByName(
                rookMockData.defaultLineUp,
                piece,
                null,
                rookMockData.defaultLineUp[2]))
            .toEqual(rookMockData.fiveMovesOneAttack)
        })

        test('should return null when no piece name is setted', () => {
            const piece = decode.fromPieceDecl(rookMockData.defaultLineUp[1])
            piece.name = ''
            expect(predictions.getOptionsByName(
                rookMockData.defaultLineUp,
                piece,
                null,
                rookMockData.defaultLineUp[2]))
            .toBeNull()
        })

        test('should return null when a wrong piece name is setted', () => {
            const piece = decode.fromPieceDecl(rookMockData.defaultLineUp[1])
            piece.name = 'X'
            expect(predictions.getOptionsByName(
                rookMockData.defaultLineUp,
                piece,
                null,
                rookMockData.defaultLineUp[2]))
            .toBeNull()
        })

    })

    describe('getKingPos', () => {
        test('should return white king position', () => {
            const piece = decode.fromPieceDecl(predictionsMockData.getKingPosLineup[0])
            expect(predictions.getKingPos(predictionsMockData.getKingPosLineup, 'W')).toEqual(piece)
        })

        test('should return black king position', () => {
            const piece = decode.fromPieceDecl(predictionsMockData.getKingPosLineup[6])
            expect(predictions.getKingPos(predictionsMockData.getKingPosLineup, 'B')).toEqual(piece)
        })

        test('should return false when no team was sent', () => {
            expect(predictions.getKingPos(predictionsMockData.getKingPosLineup)).toEqual(false)
        })

        test('should return false when wrong team was sent', () => {
            expect(predictions.getKingPos(predictionsMockData.getKingPosLineup, 'V')).toEqual(false)
        })
    })

    describe('getEnemyPositions', () => {
        test('should return black team position and attacks when lineup 1', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup, 'W'))
            .toEqual(predictionsMockData.getEnemyPositionsResult1)
        })

        test('should return white team position and attacks when lineup 1', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup, 'B'))
            .toEqual(predictionsMockData.getEnemyPositionsResult2)
        })

        test('should return black team position and attacks when lineup 2', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup1, 'W'))
            .toEqual(predictionsMockData.getEnemyPositionsResult3)
        })

        test('should return white team position and attacks when lineup 2', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup1, 'B'))
            .toEqual(predictionsMockData.getEnemyPositionsResult4)
        })
    })

    describe('getThreatenedKingData', () => {
        test('should return white ', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup, 'W'))
            .toEqual(predictionsMockData.isEnemyThreateningKingResult1)
        })

        test('should return black ', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup, 'B'))
            .toEqual(predictionsMockData.isEnemyThreateningKingResult2)
        })

        test('should return white when lineup2', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup1, 'W'))
            .toEqual(predictionsMockData.isEnemyThreateningKingResult3)
        })

        test('should return black when lineup2', () => {
            expect(predictions.getEnemyPositions(predictionsMockData.getKingPosLineup1, 'B'))
            .toEqual(predictionsMockData.isEnemyThreateningKingResult4)
        })
    })
    
    describe('willTheKingBeThreating', () => {
        test('should king be threatened when same team piece is blocking an attacker and leave the position', () => {
            const piece = decode.fromPieceDecl(predictionsMockData.willTheKingBeThreatingLineup[5])
            expect(predictions.willTheKingBeThreating(
                predictionsMockData.willTheKingBeThreatingLineup,
                piece,
                {x:5, y: 4})
            ).toEqual(predictionsMockData.willTheKingBeThreatingResult1)
        })

        test('should king not be threatened when same team piece is not blocking an attacker and leave the position', () => {
            const piece = decode.fromPieceDecl(predictionsMockData.willTheKingBeThreatingLineup[3])
            expect(predictions.willTheKingBeThreating(
                predictionsMockData.willTheKingBeThreatingLineup,
                piece,
                {x:6, y: 1})
            ).toEqual(predictionsMockData.willTheKingBeThreatingResult2)
        }) 

        test('should king not be threatened when same team piece is blocking an attacker and attack it', () => {
            const piece = decode.fromPieceDecl(predictionsMockData.willTheKingBeThreatingLineup2[5])
            expect(predictions.willTheKingBeThreating(
                predictionsMockData.willTheKingBeThreatingLineup2,
                piece,
                {x:7, y: 1})
            ).toEqual(predictionsMockData.willTheKingBeThreatingResult3)
        }) 
    })

    describe('getEnemyNextMovs', () => {
        test('should return black team next movements when using lineup 1', () => {
            expect(predictions.getEnemyNextMovs(predictionsMockData.getKingPosLineup, 'B'))
            .toEqual(predictionsMockData.getEnemyNextMovsResult1)
        }) 

        test('should return white team next movements when using lineup 1', () => {
            expect(predictions.getEnemyNextMovs(predictionsMockData.getKingPosLineup, 'W'))
            .toEqual(predictionsMockData.getEnemyNextMovsResult2)
        })     

        test('should return black team next movements when using lineup 2', () => {
            expect(predictions.getEnemyNextMovs(predictionsMockData.getKingPosLineup1, 'B'))
            .toEqual(predictionsMockData.getEnemyNextMovsResult3)
        })

        test('should return white team next movements when using lineup 2', () => {
            expect(predictions.getEnemyNextMovs(predictionsMockData.getKingPosLineup1, 'W'))
            .toEqual(predictionsMockData.getEnemyNextMovsResult4)
        })
    })
})