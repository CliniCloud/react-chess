const endGame = require('../../src/utils/endGame')
const predictions = require('../../src/utils/predictions')
const mockedData = require('./endGameMockData.json')

describe('EndGame', () => {
    describe('isCheckmate', () => {
        test('should return true when king was in checkmate position 1', () => {
            expect(endGame.isCheckmate(mockedData.isCheckmateLineup1, 'W', 'B')).toEqual(true)
        })
        
        test('should return true when king was in checkmate position 2', () => {
            expect(endGame.isCheckmate(mockedData.isCheckmateLineup2, 'W', 'B')).toEqual(true)
        })
        
        test('should return true when king was in checkmate position 4', () => {
            expect(endGame.isCheckmate(mockedData.isCheckmateLineup3, 'W', 'B')).toEqual(true)
        })
        
        test('should return true when king was in checkmate position 5', () => {
            expect(endGame.isCheckmate(mockedData.isCheckmateLineup4, 'W', 'B')).toEqual(true)
        })
        
        test('should return true when king was in checkmate position 6', () => {
            expect(endGame.isCheckmate(mockedData.isCheckmateLineup7, 'W', 'B')).toEqual(false)
        })
        
        test('should return true when king was in checkmate position 7', () => {
            expect(endGame.isCheckmate(mockedData.isCheckmateLineup8, 'W', 'B')).toEqual(false)
        })
    })

    describe('isStalemate', () => {
        test('should return true when king was stalemate position 1', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup1, 'W', 'B')).toEqual(true)
        })

        test('should return true when king was stalemate position 2', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup4, 'W', 'B')).toEqual(true)
        })

        test('should return true when king was stalemate position 3', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup5, 'W', 'B')).toEqual(true)
        })

        test('should return true when king was stalemate position 4', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup6, 'W', 'B')).toEqual(true)
        })

        test('should return true when king was stalemate position 5', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup7, 'W', 'B')).toEqual(true)
        })

        test('should return false when king has space to move', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup2, 'W', 'B')).toEqual(false)
        })

        test('should return false when same team piece blocks kigns attackers', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup3, 'W', 'B')).toEqual(false)
        })

        test('should return false when same enemy piece blocks kings attackers', () => {
            expect(endGame.isStalemate(mockedData.isStalemateLineup8, 'W', 'B')).toEqual(false)
        })
    })
    
    describe('getPieceByName', () => {
        test("should return 'Q-0@h7' when sent 'Q'", () =>{
            expect(endGame.getPieceByName(mockedData.getPieceByNameLineup, 'Q')).toEqual('Q-0@h7')
        })

        test("should return 'R-0@g8' when sent 'R'", () =>{
            expect(endGame.getPieceByName(mockedData.getPieceByNameLineup, 'R')).toEqual('R-0@g8')
        })

        test("should return 'K-0@a5' when sent 'K'", () =>{
            expect(endGame.getPieceByName(mockedData.getPieceByNameLineup, 'K')).toEqual('K-0@a5')
        })

        test("should return 'k-0@e8' when sent 'k'", () =>{
            expect(endGame.getPieceByName(mockedData.getPieceByNameLineup, 'k')).toEqual('k-0@e8')
        })

        test("should return undefined when sent 'r'", () =>{
            expect(endGame.getPieceByName(mockedData.getPieceByNameLineup, 'r')).toBeUndefined()
        })

        test("should return undefined when sent 'q'", () =>{
            expect(endGame.getPieceByName(mockedData.getPieceByNameLineup, 'q')).toBeUndefined()
        })
    })

    describe('isImpossibleCheckmate', () => {
        test('should return true when there are one white king vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup0)).toEqual(true)
        })

        test('should return true when there are one king and one bishop white in vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup1)).toEqual(true)
        })
        
        test('should return true when there are one king and one bishop black vs a white king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup2)).toEqual(true)
        })
        
        test('should return true when there are one king and one knight white vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup3)).toEqual(true)
        })
        
        test('should return true when there are one king and one knight black vs a white king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup4)).toEqual(true)
        })
        
        test('should return false when there are one king and one pawn white vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup5)).toEqual(false)
        })
        
        test('should return false when there are one king and one pawn black vs a white king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup6)).toEqual(false)
        })
        
        test('should return false when there are one king and two bishops white vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup7)).toEqual(false)
        })
        
        test('should return false when there are one king and two bishops black  vs a white king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup8)).toEqual(false)
        })
        
        test('should return false when there are one king and two knight white vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup9)).toEqual(false)
        })
        
        test('should return false when there are one king and two knight black  vs a white king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup10)).toEqual(false)
        })
        
        test('should return false when there are one king, one bishof and one knight white vs a black king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup11)).toEqual(false)
        })
        
        test('should return false when there are one king, one bishop and two knight black vs a white king', () => {
            expect(endGame.isImpossibleCheckmate(mockedData.isImpossibleCheckmateLineup12)).toEqual(false)
        })
    })

    describe('isGameFinished', () => {
        test('should return stalemate when the game is stalemate 1', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup1, 'W')).toEqual(mockedData.isGameFinishedStalemate)
        })

        test('should return stalemate when the game is stalemate 2', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup4, 'W')).toEqual(mockedData.isGameFinishedStalemate)
        })

        test('should return stalemate when the game is stalemate 3', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup5, 'W')).toEqual(mockedData.isGameFinishedStalemate)
        })

        test('should return stalemate when the game is stalemate 4', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup6, 'W')).toEqual(mockedData.isGameFinishedStalemate)
        })

        test('should return stalemate when the game is stalemate 5', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup7, 'W')).toEqual(mockedData.isGameFinishedStalemate)
        })

        test('should return checkmate when the game is checkmate 1', () => {
            expect(endGame.isGameFinished(mockedData.isCheckmateLineup1, 'W')).toEqual(mockedData.isGameFinishedCheckmate)
        })

        test('should return checkmate when the game is checkmate 2', () => {
            expect(endGame.isGameFinished(mockedData.isCheckmateLineup2, 'W')).toEqual(mockedData.isGameFinishedCheckmate)
        })

        test('should return checkmate when the game is checkmate 3', () => {
            expect(endGame.isGameFinished(mockedData.isCheckmateLineup3, 'W')).toEqual(mockedData.isGameFinishedCheckmate)
        })

        test('should return checkmate when the game is checkmate 4', () => {
            expect(endGame.isGameFinished(mockedData.isCheckmateLineup4, 'W')).toEqual(mockedData.isGameFinishedCheckmate)
        })

        test('should return draw when the game is draw 1', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup0, 'W')).toEqual(mockedData.isGameFinishedDraw)
        })

        test('should return draw when the game is draw 2', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup1, 'W')).toEqual(mockedData.isGameFinishedDraw)
        })

        test('should return draw when the game is draw 3', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup2, 'W')).toEqual(mockedData.isGameFinishedDraw)
        })

        test('should return draw when the game is draw 4', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup3, 'W')).toEqual(mockedData.isGameFinishedDraw)
        })

        test('should return draw when the game is draw 5', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup4, 'W')).toEqual(mockedData.isGameFinishedDraw)
        })

        test('should return game is not finished when position 1', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup2, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 2', () => {
            expect(endGame.isGameFinished(mockedData.isStalemateLineup3, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 3', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup5, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 4', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup6, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 5', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup7, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 6', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup8, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 7', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup9, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 8', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup10, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 9', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup11, 'W')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 10', () => {
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup13, 'B')).toEqual(mockedData.isGameFinishedFalse)
        })

        test('should return game is not finished when position 11', () => {
            const check = predictions.getThreatenedKingData(mockedData.isImpossibleCheckmateLineup13, 'W')
            expect(endGame.isGameFinished(mockedData.isImpossibleCheckmateLineup13, 'B', check)).toEqual(mockedData.isGameFinishedFalse)
        })
    })
})