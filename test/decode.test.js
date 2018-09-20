const decode = require('../src/decode')

describe('Decode', () => {
    describe('fromPieceDecl', () => {
        test("should return a valid piece object when send 'b-3@g6' ", () => {
            const result = {
                "name": "b",
                "notation": "b-3@g6",
                "piece": "b",
                "position": "g6",
                "qntPlayed": 3,
                "square": "g6",
                "x": 6,
                "y": 5
            }
            expect(decode.fromPieceDecl('b-3@g6')).toEqual(result)
        })

        test("should return a valid piece object when send 'p-23@a1' ", () => {
            const result = {
                "name": "p",
                "notation": "p-23@a1",
                "piece": "p",
                "position": "a1",
                "qntPlayed": 23,
                "square": "a1",
                "x": 0,
                "y": 0
            }
            expect(decode.fromPieceDecl('p-23@a1')).toEqual(result)
        })

        test("should return null when miss the '-' ", () => {
            expect(decode.fromPieceDecl('p23@a1')).toBeNull()
        })

        test("should return null when miss the '@' ", () => {
            expect(decode.fromPieceDecl('p-23')).toBeNull()
        })
    })

    describe('fromPosDecl', () => {
        test("should return 'b5' when x was 1 and y was 4 ", () => {
            expect(decode.fromPosDecl(1, 4)).toEqual('b5')
        })

        test("should return 'g2' when x was 6 and y was 1 ", () => {
            expect(decode.fromPosDecl(6, 1)).toEqual('g2')
        })

        test("should return 'h1' when x was 7 and y was 0 ", () => {
            expect(decode.fromPosDecl(7, 0)).toEqual('h1')
        })

        test("should return 'a8' when x was 0 and y was 7 ", () => {
            expect(decode.fromPosDecl(0, 7)).toEqual('a8')
        })

        test("should return 'e5' when x was 4 and y was 4 ", () => {
            expect(decode.fromPosDecl(4, 4)).toEqual('e5')
        })
    })
})