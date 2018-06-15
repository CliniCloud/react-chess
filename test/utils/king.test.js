const king = require('../../src/utils/king');
const decode = require('../../src/decode');
const mockedData = require('./kingMockData');

describe('king', () => {
    describe('getNextMovsAttacks', () => {
        test('should return one attack when y was -1 and x was -1', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, -1, -1))
            .toEqual({"attack": {"x": 6, "y": 2}});
        });

        test('should return one attack when y was -1 and x was 0 ', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, -1, 0))
            .toEqual({"attack": {"x": 5, "y": 2}});
        });

        test('should return one attack when y was -1 and x was 1', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, -1, 1))
            .toEqual({"nextMov": {"x": 4, "y": 2}});
        });

        test('should return one attack when y was 0 and x was -1', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 0, -1))
            .toEqual({"nextMov": {"x": 6, "y": 1}});
        });

        test('should return one attack when y was 1 and x was 0', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 1, 0))
            .toEqual( {"nextMov": {"x": 5, "y": 0}});
        });

        test('should return one attack when y was 0 and x was 1', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 0, 1))
            .toEqual( {"nextMov": {"x": 4, "y": 1}});
        });

        test('should return one attack when y was 1 and x was 1', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 1, 1))
            .toEqual( {"nextMov": {"x": 4, "y": 0}});
        });

        test('should return null when there is no modification on column or rows', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 0, 0))
            .toBeNull();
        });

        test('should return null when y is less than 0 ', () => {
            const piece = decode.fromPieceDecl(mockedData.getNextMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 1, 0))
            .toBeNull();
        });

        test('should return null when x is less than 0 ', () => {
            const piece = decode.fromPieceDecl(mockedData.getNextMovsAttacksLineUp[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp, piece, 0, 1))
            .toBeNull();
        });

        test('should return null when x is higher than 8 ', () => {
            const piece = decode.fromPieceDecl(mockedData.getNextMovsAttacksLineUp2[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp2, piece, 0, -1))
            .toBeNull();
        });

        test('should return null when y is higher than 8 ', () => {
            const piece = decode.fromPieceDecl(mockedData.getNextMovsAttacksLineUp2[0]);
            expect(king.getNextMovsAttacks(mockedData.createMovsAttacksLineUp2, piece, -1, 0))
            .toBeNull();
        });
    });

    describe('createMovsAttacks', () => {
        test('should return 2 attacks and 5 movements', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp[0]);
            expect(king.createMovsAttacks(mockedData.createMovsAttacksLineUp, piece))
            .toEqual(mockedData.createMovsAttacksResult1);
        });

        test('should return 2 attacks and 3 movements', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp1[0]);
            expect(king.createMovsAttacks(mockedData.createMovsAttacksLineUp1, piece))
            .toEqual(mockedData.createMovsAttacksResult2);
        });

        test('should return no attacks and 5 movements', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp3[0]);
            expect(king.createMovsAttacks(mockedData.createMovsAttacksLineUp3, piece))
            .toEqual(mockedData.createMovsAttacksResult4);
        });

        test('should return no attacks and 4 movements', () => {
            const piece = decode.fromPieceDecl(mockedData.createMovsAttacksLineUp4[0]);
            expect(king.createMovsAttacks(mockedData.createMovsAttacksLineUp4, piece))
            .toEqual(mockedData.createMovsAttacksResult5);
        });

        test('should return no attacks and 3 movements', () => {
            const piece = decode.fromPieceDecl(mockedData.getNextMovsAttacksLineUp2[0]);
            expect(king.createMovsAttacks(mockedData.getNextMovsAttacksLineUp2, piece))
            .toEqual(mockedData.createMovsAttacksResult6);
        });

        test('should return 1 attack and 2 movements 1', () => {
            const piece = decode.fromPieceDecl(mockedData.getNextMovsAttacksLineUp[0]);
            expect(king.createMovsAttacks(mockedData.getNextMovsAttacksLineUp, piece))
            .toEqual(mockedData.createMovsAttacksResult7);
        });
    });
    describe('getCastlingPosLineup', () => {
        test('should return white rook castling piece and king x and y position when moving right', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup, 0, 'right'))
            .toEqual(mockedData.getCastlingPosResult1);
        });

        test('should return white rook castling piece and king x and y position when moving left', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup, 0, 'left'))
            .toEqual(mockedData.getCastlingPosResult2);
        });

        test('should return black rook castling piece and king x and y position when moving right', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup, 7, 'right'))
            .toEqual(mockedData.getCastlingPosResult3);
        });

        test('should return black rook castling piece and king x and y position when moving left', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup, 7, 'left'))
            .toEqual(mockedData.getCastlingPosResult4);
        });

        test('should return null when white right rook alredy did a movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup1, 0, 'right'))
            .toBeNull();
        });

        test('should return null when white left rook alredy did a movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup1, 0, 'left'))
            .toBeNull();
        });

        test('should return null when black right rook alredy did a movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup1, 7, 'right'))
            .toBeNull();
        });

        test('should return null when black left rook alredy did a movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup1, 7, 'left'))
            .toBeNull();
        });

        test('should return null when there is white piece between right movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup2, 0, 'right'))
            .toBeNull();
        });

        test('should return null when there is white piece between left movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup2, 0, 'left'))
            .toBeNull();
        });

        test('should return null when there is black piece between right movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup2, 7, 'right'))
            .toBeNull();
        });

        test('should return null when there is black piece between left movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup2, 7, 'left'))
            .toBeNull();
        });

        test('should return null when there is a white enemy piece between right movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup3, 0, 'right'))
            .toBeNull();
        });

        test('should return null when there is white enemy piece between left movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup3, 0, 'left'))
            .toBeNull();
        });

        test('should return null when there is black enemy piece between right movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup3, 7, 'right'))
            .toBeNull();
        });

        test('should return null when there is black enemy piece between left movement', () => {
            expect(king.getCastlingPos(mockedData.getCastlingPosLineup3, 7, 'left'))
            .toBeNull();
        });
    });

    describe('removeNextMovsByEnemyMovs', () => {
        test('should return 4 movements when enemy has 1 different pieces attacking', () => {
            expect(king.removeNextMovsByEnemyMovs(
                mockedData.removeNextMovsByEnemyMovsLineup1.myTeam,
                mockedData.removeNextMovsByEnemyMovsLineup1.enemy
            ))
            .toEqual(mockedData.removeNextMovsByEnemyMovsResult1);
        });

        test('should return 2 movements when enemy has 2 different pieces attacking', () => {
            expect(king.removeNextMovsByEnemyMovs(
                mockedData.removeNextMovsByEnemyMovsLineup2.myTeam,
                mockedData.removeNextMovsByEnemyMovsLineup2.enemy
            ))
            .toEqual(mockedData.removeNextMovsByEnemyMovsResult2);
        });

        test('should return 2 movements when enemy has 3 different pieces attacking', () => {
            expect(king.removeNextMovsByEnemyMovs(
                mockedData.removeNextMovsByEnemyMovsLineup3.myTeam,
                mockedData.removeNextMovsByEnemyMovsLineup3.enemy
            ))
            .toEqual(mockedData.removeNextMovsByEnemyMovsResult2);
        });

        test('should return 5 movements when enemy has a pawn attacking', () => {
            expect(king.removeNextMovsByEnemyMovs(
                mockedData.removeNextMovsByEnemyMovsLineup4.myTeam,
                mockedData.removeNextMovsByEnemyMovsLineup4.enemy
            ))
            .toEqual(mockedData.removeNextMovsByEnemyMovsResult4);
        });
    });

    describe('removeNextMovsByEnemyPawsMovs', () => {
        test('should return 3 movements when enemy has 2 pawn attacking', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.removeNextMovsByEnemyPawsMovsLineup[0]);
            expect(king.removeNextMovsByEnemyPawsMovs(
                mockedData.removeNextMovsByEnemyPawsMovsLineup,
                kingPiece.piece,
                mockedData.removeNextMovsByEnemyPawsMovsMovs
            ))
            .toEqual(mockedData.removeNextMovsByEnemyPawsMovsResult);
        });

        test('should return 4 movements when enemy has 1 pawn attacking', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.removeNextMovsByEnemyPawsMovsLineup2[5]);
            expect(king.removeNextMovsByEnemyPawsMovs(
                mockedData.removeNextMovsByEnemyPawsMovsLineup2,
                kingPiece.piece,
                mockedData.removeNextMovsByEnemyPawsMovsMovs2
            ))
            .toEqual(mockedData.removeNextMovsByEnemyPawsMovsResult2);
        });
    });

    describe('getOptions', () => {
        test('should return 3 movements and 2 rook pos for castling', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.getOptionsLineup1[0]);
            expect(king.getOptions(
                mockedData.getOptionsLineup1,
                kingPiece,
                mockedData.getOptionsEnemysMovs1
            )).toEqual(mockedData.getOptionsResult1);
        });

        test('should return 1 movement', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.getOptionsLineup2[0]);
            expect(king.getOptions(
                mockedData.getOptionsLineup2,
                kingPiece,
                mockedData.getOptionsEnemysMovs1
            )).toEqual(mockedData.getOptionsResult2);
        });

        test('should return 3 movements', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.getOptionsLineup3[0]);
            expect(king.getOptions(
                mockedData.getOptionsLineup3,
                kingPiece,
                mockedData.getOptionsEnemysMovs1
            )).toEqual(mockedData.getOptionsResult3);
        });

        test('should return 3 movements and 1 attack', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.getOptionsLineup4[0]);
            expect(king.getOptions(
                mockedData.getOptionsLineup4,
                kingPiece,
                mockedData.getOptionsEnemysMovs2
            )).toEqual(mockedData.getOptionsResult4);
        });

        test('should return 4 movements and 1 attack', () => {
            const kingPiece = decode.fromPieceDecl(mockedData.getOptionsLineup5[0]);
            expect(king.getOptions(
                mockedData.getOptionsLineup5,
                kingPiece,
                mockedData.getOptionsEnemysMovs3
            )).toEqual(mockedData.getOptionsResult5);
        });
    });
});