const bishop = require('../../src/utils/bishop');
const decode = require('../../src/decode');
const mockedData = require('./bishopMockData');

describe('Bishop', () => {
    let endedDirection;
    
    describe('getAttacktNextMov', () => {
        beforeEach(() => {
            endedDirection = {
                topLeft: false,
                topRight: false,
                downRight: false,
                downLeft: false
            }
        });

        test('should return null for a invalid position', () => {
            let piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            piece = Object.assign({}, piece, {
                side: 'topLeft'
            });
            piece.col = 9;
            piece.row = 2;
            const result = bishop.getAttacktNextMov(mockedData.oneMovLineup, piece, endedDirection);
            expect(result).toBeNull();
        });

        test('should create a movement', () => {
            let piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            piece = Object.assign({}, piece, {
                side: 'topLeft'
            });
            piece.col = 6;
            piece.row = 2;
            const result = bishop.getAttacktNextMov(mockedData.oneMovLineup, piece, endedDirection);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.oneMovUpperLeftResult);
        });

        test('should create an attack', () => {
            let piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            piece = Object.assign({}, piece, {
                side: 'topLeft'
            });
            piece.col = 4;
            piece.row = 4;
            const result = bishop.getAttacktNextMov(mockedData.oneMovLineup, piece, endedDirection);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.oneAttUpperLeftResult);
        });

        test('should return endDir with topLef flag as true', () => {
            let piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            const lineup = mockedData.oneMovLineup.slice(0);
            lineup.push('P-3@g3');
            piece = Object.assign({}, piece, {
                side: 'topLeft'
            });
            piece.col = 6;
            piece.row = 2;
            const result = bishop.getAttacktNextMov(lineup, piece, endedDirection);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.sameTeamPieacePos);
        });
    });

    describe('Valid Position', () => {
        test('should return false when row lower than 0', () => {
            const piece = {
                x: 2,
                col: 1,
                y: 0,
                row: -1,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(false);
        });

        test('should return false when row higher than 7', () => {
            const piece = {
                x: 2,
                col: 1,
                y: 9,
                row: 8,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(false);
        });

        test('should return false when row and y equal', () => {
            const piece = {
                x: 2,
                col: 1,
                y: 8,
                row: 8,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(false);
        });

        test('should return false when column lower than 0', () => {
            const piece = {
                x: 0,
                col: -1,
                y: 5,
                row: 4,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(false);
        });

        test('should return false when column higher than 7', () => {
            const piece = {
                x: 9,
                col: 8,
                y: 5,
                row: 4,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(false);
        });

        test('should return false when col and x equal', () => {
            const piece = {
                x: 2,
                col: 2,
                y: 7,
                row: 8,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(false);
        });

        test('should return true when col and row were under the limits', () => {
            const piece = {
                x: 1,
                col: 0,
                y: 8,
                row: 7,
            };
            const result = bishop.isPositionValid(piece);
            expect(result).toEqual(true);
        });

    });

    describe('isTopLeftPosition', () => {
        let validPiece;
        let endDir;

        beforeEach(() => {
            validPiece = {
                side: 'topLeft',
                col: 1,
                x: 2,
                row: 2,
                y: 1,
            };
            endDir = {
                topLeft: false
            };
        })

        test("should return true when there is valid piece", () => {
            const result = bishop.isTopLeftPosition(validPiece, endDir);
            expect(result).toEqual(true);
        });

        test('should return false when side is not "topLeft"', () => {
            validPiece.side = 'topRight'
            const result = bishop.isTopLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when topLeft attribute of endDir parameter was false', () => {
            endDir = {
                topLeft: true
            };
            const result = bishop.isTopLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when row was equal to y", () => {
            validPiece.row = 2;
            validPiece.y = 2;
            const result = bishop.isTopLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when row was lower than y", () => {
            validPiece.row = 1;
            validPiece.y = 2;
            const result = bishop.isTopLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when col was higer than y", () => {
            validPiece.col = 3;
            validPiece.y = 2;
            const result = bishop.isTopLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });
    });

    describe('isDownLeftPosition', () => {
        let validPiece;
        let endDir;

        beforeEach(() => {
            validPiece = {
                side: 'downLeft',
                col: 1,
                x: 2,
                row: 1,
                y: 2,
            };

            endDir = {
                downLeft: false
            };
        })

        test("should return true when there is valid piece", () => {
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(true);
        });

        test('should return false when side is not "downLeft"', () => {
            validPiece.side = 'topRight'
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when downLeft endDir attribute was true", () => {
            endDir = {
                downLeft: true
            };
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when row and y were equal", () => {
            validPiece.row = 2;
            validPiece.y = 2;
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when row was higher than y", () => {
            validPiece.row = 3;
            validPiece.y = 2;
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when col was higher than x", () => {
            validPiece.col = 3;
            validPiece.x = 2;
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test("should return false when col and x were equal", () => {
            validPiece.col = 2;
            validPiece.x = 2;
            const result = bishop.isDownLeftPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });
    });

    describe('isDownRightPosition', () => {
        let validPiece;
        let endDir;

        beforeEach(() => {
            validPiece = {
                side: 'downRight',
                col: 3,
                x: 2,
                row: 1,
                y: 2,
            };

            endDir = {
                downRight: false
            };
        });

        test('should return true when there is a valid piece', () => {
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(true);
        });

        test('should return false when side is not "downRight"', () => {
            validPiece.side = 'topRight'
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when downRight endDir attribute was true', () => {
            endDir.downRight = true;
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when col and x were equal', () => {
            validPiece.col = 3;
            validPiece.x = 3;
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when col was lower than x', () => {
            validPiece.col = 3;
            validPiece.x = 4;
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when row and x were equal', () => {
            validPiece.row = 5;
            validPiece.y = 5;
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when row was higher than x', () => {
            validPiece.row = 5;
            validPiece.y = 4;
            const result = bishop.isDownRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });
    });

    describe('isTopRightPosition', () => {
        let validPiece;
        let endDir;

        beforeEach(() => {
            validPiece = {
                side: 'topRight',
                col: 3,
                x: 2,
                row: 3,
                y: 2,
            };

            endDir = {
                topRight: false
            };
        });

        test('should return true when there is a valid piece', () => {
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(true);
        });

        test('should return false when side is not "topRight"', () => {
            validPiece.side = 'downRight'
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when topRight is true', () => {
            endDir = {
                topRight: true
            };
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when row and y were equal', () => {
            validPiece.row = 2;
            validPiece.y = 2;
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when row was lower than y', () => {
            validPiece.row = 1;
            validPiece.y = 2;
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when col and x were equal', () => {
            validPiece.col = 2;
            validPiece.x = 2;
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });

        test('should return false when col was lower than x', () => {
            validPiece.col = 1;
            validPiece.x = 2;
            const result = bishop.isTopRightPosition(validPiece, endDir);
            expect(result).toEqual(false);
        });
    });

    describe('generateBishopPos', () => {
        let endDir;

        beforeEach(() => {
            endDir = {
                topLeft: false,
                topRight: false,
                downRight: false,
                downLeft: false
            };
        });
        test('should create a movent', () => {
            const piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            const side = 'topLeft';
            const index = 1;
            const result = bishop.generateBishopPos(mockedData.oneMovLineup, piece, endDir, index, side);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.oneMovUpperLeftResult);
        });

        test('should create an attack', () => {
            const piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            const side = 'topLeft';
            const index = 3;
            const result = bishop.generateBishopPos(mockedData.oneMovLineup, piece, endDir, index, side);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.oneAttUpperLeftResult);
        });

        test('should just return endDir object updated', () => {
            const lineup = mockedData.oneMovLineup.slice(0);
            lineup.push('P-3@g3');
            const piece = decode.fromPieceDecl(lineup[1]);
            const side = 'topLeft';
            const index = 1;
            const result = bishop.generateBishopPos(lineup, piece, endDir, index, side);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.sameTeamPieacePos);
        });

        test('should return false when a get a invalid position', () => {
            const piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            const side = 'topLeft';
            const index = 9;
            const result = bishop.generateBishopPos(mockedData.oneMovLineup, piece, endDir, index, side);
            expect(result).toBeNull();
        });
    });

    describe('compareEndDirs', () => {
        test('should return true when oldEndDir attributes were true', () => {
            const oldEndDir = {
                topLeft: true,
                topRight: true,
                downRight: true,
                downLeft: true,
            }

            const newEndDir = {
                topLeft: true,
                topRight: false,
                downRight: false,
                downLeft: null,
            }
            const result = bishop.compareEndDirs(oldEndDir, newEndDir);
            expect(result).not.toBeNull();
            expect(result.topLeft).toEqual(true);
            expect(result.topRight).toEqual(true);
            expect(result.downRight).toEqual(true);
            expect(result.downLeft).toEqual(true);
        });

        test('should return true when newEndDir attributes were true', () => {
            const newEndDir = {
                topLeft: true,
                topRight: true,
                downRight: true,
                downLeft: true,
            }

            const oldEndDir = {
                topLeft: true,
                topRight: false,
                downRight: false,
                downLeft: null,
            }
            const result = bishop.compareEndDirs(oldEndDir, newEndDir);
            expect(result).not.toBeNull();
            expect(result.topLeft).toEqual(true);
            expect(result.topRight).toEqual(true);
            expect(result.downRight).toEqual(true);
            expect(result.downLeft).toEqual(true);
        });

        test('should return false when newEndDir and oldEndDir attributes were false', () => {
            const newEndDir = {
                topLeft: false,
                topRight: false,
                downRight: false,
                downLeft: false,
            }
    
            const oldEndDir = {
                topLeft: false,
                topRight: false,
                downRight: false,
                downLeft: false,
            }
            const result = bishop.compareEndDirs(oldEndDir, newEndDir);
            expect(result).not.toBeNull();
            expect(result.topLeft).toEqual(false);
            expect(result.topRight).toEqual(false);
            expect(result.downRight).toEqual(false);
            expect(result.downLeft).toEqual(false);
        });
    });

    describe('getOptions', () => {
        test('should return three movements and one attack', () => {
            const piece = decode.fromPieceDecl(mockedData.oneMovLineup[1]);
            const result = bishop.getOptions(mockedData.oneMovLineup, piece);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.threeMovOneAttResult);
        });

        test('should return attack to king threatening enemy', () => {
            const piece = decode.fromPieceDecl(mockedData.threateningKingLineup[1]);
            const result = bishop.getOptions(mockedData.threateningKingLineup, piece, mockedData.threateningKingLineup[8]);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.threateningKingResult);
        });

        test('should return three attack and one movement', () => {
            const piece = decode.fromPieceDecl(mockedData.threeAttOneMovLineup[1]);
            const result = bishop.getOptions(mockedData.threeAttOneMovLineup, piece);
            expect(result).not.toBeNull();
            expect(result).toEqual(mockedData.threeAttOneMovResult);
        });
    });
});