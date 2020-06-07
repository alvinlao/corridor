import * as R from 'ramda'
import { game } from '../core/game'
import { point } from '../core/point'
import { vwall, hwall, isVertical } from '../core/wall'
import { useMove, useWall } from '../core/turn'

// RESET, MOVE, WALL :: TurnType
// TurnType is 2 bits.
const RESET = 0
const MOVE = 1
const WALL = 2

// turnTypeFieldMask :: Number
// Masks 2 bits.
const turnTypeFieldMask = 3

// encodeReset :: Number -> Notation Reset
// Notation a :: String (all ASCII characters)
// Encodes the reset into 1 byte.
export const encodeReset = (numPlayers) =>
  String.fromCharCode(RESET | (numPlayers << 2))

// decodeReset :: Notation Reset -> Number
const decodeReset = (notation) => (notation.charCodeAt() >> 2)

// encodeUseMove :: Point -> Notation Point
// Encodes the move into 2 bytes.
export const encodeUseMove = (point) =>
  String.fromCharCode(MOVE, encodePoint(point))

// encodeUseWall :: Wall -> Notation Wall
// Encodes the wall into 2 bytes.
export const encodeUseWall = (wall) =>
  String.fromCharCode(
    WALL | (isVertical(wall) ? 1 : 0) << 2,
    encodePoint(R.head(wall.points)))

// decodeUseWall :: Notation Wall -> Wall
export const decodeUseWall = (notation) => {
  const isVertical = notation.charCodeAt() >> 2
  const topLeft = decodePoint(notation.charCodeAt(1))
  return isVertical ? vwall(topLeft) : hwall(topLeft)
}

// encodePoint :: Point -> Number
// Converts a point to a byte.
export const encodePoint = (point) => point.col + (point.row * 9)

// decodePoint :: Number -> Point
// Converts the provided byte to a Point.
export const decodePoint = (n) => {
  const row = Math.floor(n / 9)
  const col = n - (row * 9)
  return point(row, col)
}

// decodeTurn :: Notation -> (Game -> Game)
// Decodes the binary representation into a function that applies
// the encoded move to the given Game.
export const decodeTurn = (notation) => {
  const turnType = decodeTurnType(notation.charCodeAt(0))
  const payload = notation.charCodeAt(1)

  return (currentGame) => {
    switch (turnType) {
      case RESET:
        return game(decodeReset(notation))
      case MOVE:
        return useMove(currentGame, decodePoint(payload))
      case WALL:
        return useWall(currentGame, decodeUseWall(notation))
      default:
        return currentGame
    }
  }
}

// decodeChar :: Char -> Number
export const decodeChar = (char) => char.charCodeAt()

// notationLength :: Byte -> Number
// Given a turn type, returns the length of its corresponding notation.
export const notationLength = (byte) => {
  const turnType = decodeTurnType(byte)
  switch (turnType) {
    case RESET:
      return 1
    case MOVE:
      return 2
    case WALL:
      return 3
    default:
      return 1000
  }
}

// decodeTurnType :: Byte -> TurnType
const decodeTurnType = (byte) => byte & turnTypeFieldMask
