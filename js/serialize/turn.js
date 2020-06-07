import * as R from 'ramda'
import { game, playerLocation } from '../core/game'
import { point, north, south, east, west } from '../core/point'
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

// encodeUseMove :: Game -> Point -> Notation Point
// Encodes the move into 1 byte.
export const encodeUseMove = (game, point) =>
  String.fromCharCode(MOVE | moveDirection(game, point) << 2)

// moveMap :: {Number: (Point -> Point)}
// Map of number to direction.
const moveMap = {
  0: north,
  1: south,
  2: east,
  3: west,
  4: R.compose(north, north),
  5: R.compose(south, south),
  6: R.compose(east, east),
  7: R.compose(west, west),
  8: R.compose(north, west),
  9: R.compose(north, east),
  10: R.compose(south, west),
  11: R.compose(south, east),
}

// moveDirection :: Game -> Point -> Number
// Maps the move to a number between 0 and 12.
export const moveDirection = (game, point) => {
  const location = playerLocation(game, game.activePlayerId)
  return R.head(
    R.reject(
      R.isNil,
        R.map(
          ([k, f]) => R.equals(point, f(location)) ? parseInt(k) : null,
          R.toPairs(moveMap))))
}

// decodeUseMove :: Game -> Notation Move -> Point
export const decodeUseMove = (game, notation) => {
  const location = playerLocation(game, game.activePlayerId)
  return moveMap[notation.charCodeAt() >> 2](location)
}

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
  const turnType = decodeTurnType(notation.charCodeAt())
  return (currentGame) => {
    switch (turnType) {
      case RESET:
        return game(decodeReset(notation))
      case MOVE:
        return useMove(currentGame, decodeUseMove(currentGame, notation))
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
      return 1
    case WALL:
      return 2
    default:
      throw "Encountered invalid turn type: " + turnType
  }
}

// decodeTurnType :: Byte -> TurnType
const decodeTurnType = (byte) => byte & turnTypeFieldMask
