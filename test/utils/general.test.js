const general = require('../../src/utils/general');
const decode = require('../../src/decode');
const mockedData = require('./generalMockData.json');

describe('general', () => {
    let currentEnv;
    beforeAll(() => {
        currentEnv = process.env.NODE_ENV;
    })

    afterAll(() => {
        process.env.NODE_ENV = currentEnv;
    })
    
    describe('isTestEnv', () => {
        test('should return false if NODE_ENV is not development', () => {
            process.env.NODE_ENV='production';
            expect(general.isTestEnv()).toEqual(false);
        });
        
        test('should return true if NODE_ENV is development', () => {
            process.env.NODE_ENV='development';
            expect(general.isTestEnv()).toEqual(true);
        });
    });

    describe('isPieceTurn', () => {
        test('should return true when piece name was upper case and turn was W', () => {
            expect(general.isPieceTurn('P', 'W')).toEqual(true);
        });
    
        test('should return false when piece name was lower case and turn was W', () => {
            expect(general.isPieceTurn('p', 'W')).toEqual(false);
        });
        
        test('should return true when piece name was lower case and turn was B', () => {
            expect(general.isPieceTurn('p', 'B')).toEqual(true);
        });
    
        test('should return false when piece name was upper case and turn was B', () => {
            expect(general.isPieceTurn('P', 'B')).toEqual(false);
        });
    });

    describe('hasPawnPieceChange', () => {
        test('should return true when a pawn with lower case name reach the top', () => {
            expect(general.hasPawnPieceChange('p', {x: 2, y:7})).toEqual(true);
        });

        test('should return false when a pawn with lower case name does not reach the top', () => {
            expect(general.hasPawnPieceChange('p', {x: 2, y:6})).toEqual(false);
        });

        test('should return true when a pawn with upper case name reach the bottom', () => {
            expect(general.hasPawnPieceChange('P', {x: 2, y:0})).toEqual(true);
        });

        test('should return false when a pawn with upper case name does not reach the bottom', () => {
            expect(general.hasPawnPieceChange('P', {x: 2, y:1})).toEqual(false);
        });

        test('should return false when the piece is not a pawn', () => {
            expect(general.hasPawnPieceChange('B', {x: 2, y:0})).toEqual(false);
        });
    });
    
    describe('whatIsMyTeam', () => {
        test("should return 'W' when send a piece with upper case name", () => {
            expect(general.whatIsMyTeam('B')).toEqual('W');
        });

        test("should return 'B' when send a piece with lower case name", () => {
            expect(general.whatIsMyTeam('b')).toEqual('B');
        });
    });
    
    describe('whatIsEnemyTeam', () => {
        test("should return 'W' when send a piece with lower case name", () => {
            expect(general.whatIsEnemyTeam('B')).toEqual('B');
        });

        test("should return 'B' when send a piece with upper case name", () => {
            expect(general.whatIsEnemyTeam('b')).toEqual('W');
        });
    });
    
    describe('isBetweenRange', () => {
        test('should return true when is sent 0 or any number between 0 and 7', () => {
            expect(general.isBetweenRange(0)).toEqual(true);
        });

        test('should return true when is sent 7 or any number between 0 and 7', () => {
            expect(general.isBetweenRange(7)).toEqual(true);
        });

        test('should return true when is sent 3 or any number between 0 and 7', () => {
            expect(general.isBetweenRange(3)).toEqual(true);
        });

        test('should return false when is sent less than 0', () => {
            expect(general.isBetweenRange(-1)).toEqual(false);
        });

        test('should return false when is sent higher than 7', () => {
            expect(general.isBetweenRange(8)).toEqual(false);
        });
    });

    describe('getColumn', () => {
        test("should return 'a' when is sent 0", () => {
            expect(general.getColumn(0)).toEqual('a');
        });

        test("should return 'b' when is sent 1", () => {
            expect(general.getColumn(1)).toEqual('b');
        });

        test("should return 'c' when is sent 2", () => {
            expect(general.getColumn(2)).toEqual('c');
        });

        test("should return 'd' when is sent 3", () => {
            expect(general.getColumn(3)).toEqual('d');
        });

        test("should return 'e' when is sent 4", () => {
            expect(general.getColumn(4)).toEqual('e');
        });

        test("should return 'f' when is sent 5", () => {
            expect(general.getColumn(5)).toEqual('f');
        });

        test("should return 'g' when is sent 6", () => {
            expect(general.getColumn(6)).toEqual('g');
        });

        test("should return 'h' when is sent 7", () => {
            expect(general.getColumn(7)).toEqual('h');
        });
    });

    describe('isPiecesFromSameTeam', () => {
        test('should return true when both pieces have lower case name', () => {
            const pieceA = {name: 'p'};
            const pieceB = {name: 'k'};
            expect(general.isPiecesFromSameTeam(pieceA, pieceB)).toEqual(true);
        });
        
        test('should return true when both pieces have upper case name', () => {
            const pieceA = {name: 'N'};
            const pieceB = {name: 'B'};
            expect(general.isPiecesFromSameTeam(pieceA, pieceB)).toEqual(true);
        });

        test('should return false when one of the pieces have lower case name and another upper case name', () => {
            const pieceA = {name: 'p'};
            const pieceB = {name: 'K'};
            expect(general.isPiecesFromSameTeam(pieceA, pieceB)).toEqual(false);
        });
    });

    describe('getPieceObject', () => {
        test('should return decoded object', () => {
            expect(general.getPieceObject('b-10@g1', 2, 'g1')).toEqual(mockedData.getPieceObjectResult);
        });

        test('should return decoded object with no position parameter', () => {
            expect(general.getPieceObject('p-21@a1', 7)).toEqual(mockedData.getPieceObjectNoPositionResult);
        });

        test('should return decoded object with no position parameter and 2 qntPlayed', () => {
            expect(general.getPieceObject('p-2@a1', 7)).toEqual(mockedData.getPiece2QntPlayedNoPositionResult);
        });
    });

    describe('findPieceAtPosition', () => {
        test("should return '@g3' when position was 'p-0@g3' ", () => {
            expect(general.findPieceAtPosition(mockedData.findPieceAtPositionLineup, '@g3'))
            .toEqual(mockedData.findPieceAtPositionG3Result);
        });

        test("should return 'p-0@g3' when position was 'g3' ", () => {
            expect(general.findPieceAtPosition(mockedData.findPieceAtPositionLineup, 'g3'))
            .toEqual(mockedData.findPieceAtPositionG3Result);
        });

        test("should return 'k-28@h5' when position was 'h5' ", () => {
            expect(general.findPieceAtPosition(mockedData.findPieceAtPositionLineup, 'h5'))
            .toEqual(mockedData.findPieceAtPositionH5Result);
        });

        test("should return 'K-20@a2' when position was 'a2' ", () => {
            expect(general.findPieceAtPosition(mockedData.findPieceAtPositionLineup, 'a2'))
            .toEqual(mockedData.findPieceAtPositionA2Result);
        });
    });

    describe('filterByTypeOfPieces', () => {
        test('should return pieces array with B, P, K ', () => {
            expect(general.filterByTypeOfPieces(mockedData.filterByTypeOfPiecesLineup, 'BPK'))
            .toEqual(mockedData.filterByTypeOfPiecesResult);
        });

        test('should return pieces array with P, Q ', () => {
            expect(general.filterByTypeOfPieces(mockedData.filterByTypeOfPiecesLineup, 'PQ'))
            .toEqual(mockedData.filterByTypeOfPiecesQPResult);
        });

        test('should return pieces array with K ', () => {
            expect(general.filterByTypeOfPieces(mockedData.filterByTypeOfPiecesLineup, 'k'))
            .toEqual(mockedData.filterByTypeOfPiecesKResult);
        });
    });

    describe('isSameTeamPiece', () => {
        test('should return true when there is same team piece in the destination postion ', () => {
            const piece = decode.fromPieceDecl(mockedData.findPieceAtPositionLineup[0]);
            expect(general.isSameTeamPiece(mockedData.findPieceAtPositionLineup, piece, 'e5')).toEqual(true);
        });

        test('should return false when there is enemy piece in the destination postion ', () => {
            const piece = decode.fromPieceDecl(mockedData.findPieceAtPositionLineup[0]);
            expect(general.isSameTeamPiece(mockedData.findPieceAtPositionLineup, piece, 'f6')).toEqual(false);
        });

        test('should return null when there is no piece in the destination postion ', () => {
            const piece = decode.fromPieceDecl(mockedData.findPieceAtPositionLineup[0]);
            expect(general.isSameTeamPiece(mockedData.findPieceAtPositionLineup, piece, 'g7')).toBeNull();
        });
    });

    describe('isMovementValid', () => {
        test("should return true when there is destination position in piece's allowed movements", () => 
            expect(general.isMovementValid(
                mockedData.isMovementValidMovements,
                mockedData.isMovementValidAttacks,
                {"x":2, "y":3})
            ).toEqual({"x":2, "y":4})
        );

        test("should return true when there is destination position in piece's allowed attacks", () => 
            expect(general.isMovementValid(
                mockedData.isMovementValidMovements,
                mockedData.isMovementValidAttacks,
                {"x":5, "y":6})
            ).toEqual({"x":5, "y":1})
        );

        test("should return null when there is no destination position in piece's allowed attacks or movements", () => 
            expect(general.isMovementValid(
                mockedData.isMovementValidMovements,
                mockedData.isMovementValidAttacks,
                {"x":6, "y":6})
            ).toBeNull()
        );
    });

    describe('getPiecesFromTeam', () => {
        test('return array of pieces from white team', () => {
            expect(general.getPiecesFromTeam(mockedData.getPiecesFromTeamLineup, 'W')).toEqual(mockedData.getPiecesFromTeamWhiteResult);
        });

        test('return array of pieces from black team', () => {
            expect(general.getPiecesFromTeam(mockedData.getPiecesFromTeamLineup, 'B')).toEqual(mockedData.getPiecesFromTeamBlackResult);
        });
    });

    describe("getThreateningAttack", () => {
        test("should return just one attack with the threatening king's position", () => {
            const result = general.getThreateningAttack(mockedData.attacks, `p-2@e6`)
            expect(result).not.toBeNull()
            expect(result).toEqual(mockedData.threatenedPos)
        })
    
        test("should not return any attack when king is not threatened", () => {
            const result = general.getThreateningAttack(mockedData.attacks)
            expect(result).toBeNull()
        })
    
        test("should not return any attack when you can not attack the king's threatening", () => {
            const result = general.getThreateningAttack(mockedData.attacks,`p-2@f7`)
            expect(result).not.toBeNull()
            expect(result).toHaveLength(0)
        })
    })

});