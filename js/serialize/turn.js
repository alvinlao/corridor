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
// Notation :: String (all ASCII characters)
// Encodes the reset into a single byte.
export const encodeReset = (numPlayers) =>
  String.fromCharCode(RESET | (numPlayers << 2))

// decodeReset :: Notation Reset -> Number
const decodeReset = (notation) => (notation.charCodeAt() >> 2)

// encodeUseMove :: Point -> Notation Point
// Encodes the move into a binary representation.
export const encodeUseMove = (point) => encodeTurn(MOVE, [encodePoint(point)])

// encodeUseWall :: Wall -> Notation Wall
// Encodes the wall into a binary representation.
export const encodeUseWall = (wall) => encodeTurn(WALL, encodeWall(wall))

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

// encodeWall :: Wall -> [Number]
// Converts a wall to two bytes.
export const encodeWall = (wall) => ([
  encodePoint(R.head(wall.points)),
  (isVertical(wall) ? 1 : 0)
])

// decodeWall :: [Number] -> Point
// Converts the provided 7 bits to a wall.
export const decodeWall = (ns) => {
  const topLeft = decodePoint(ns[0])
  const isVertical = ns[1] & 1
  return isVertical ? vwall(topLeft) : hwall(topLeft)
}

// encodeTurn :: TurnType -> [Number] -> Notation
// Encodes the payload and turn type into a binary representation
const encodeTurn = (type, payload) => String.fromCharCode(type, ...payload)

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
        return useWall(currentGame, decodeWall([payload, notation.charCodeAt(2)]))
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
