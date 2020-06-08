import * as R from 'ramda'
import { game, playerLocation } from '../core/game'
import { point, north, south, east, west } from '../core/point'
import { vwall, hwall, isVertical } from '../core/wall'
import { useMove, useWall } from '../core/turn'

// MOVE, WALL :: ActionType
// ActionType is 1 bit.
const MOVE = 0
const WALL = 1

// decodeActionType :: Byte -> ActionType
const decodeActionType = (byte) => byte & 1

// encodeInit :: Number -> Notation Init
// Notation a :: [Byte] :: String
// Encodes the initialize game action into 1 byte.
export const encodeInit = (numPlayers) =>
  String.fromCharCode(numPlayers)

// decodeInit :: Notation Init -> Number
export const decodeInit = (notation) => notation.charCodeAt()

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

// decodeAction :: Notation -> (Game -> Game)
// Decodes the binary representation into a function that applies
// the encoded move to the given Game.
export const decodeAction = (notation) => {
  const actionType = decodeActionType(notation.charCodeAt())
  return (currentGame) => {
    switch (actionType) {
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
// Given an action type, returns the length of its corresponding notation.
export const notationLength = (byte) => {
  const actionType = decodeActionType(byte)
  switch (actionType) {
    case MOVE:
      return 1
    case WALL:
      return 2
    default:
      throw "Encountered invalid action type: " + actionType
  }
}
