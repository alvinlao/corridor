import * as R from 'ramda'
import { game, playerLocation } from '../core/game'
import { point, north, south, east, west } from '../core/point'
import { vwall, hwall, isVertical } from '../core/wall'
import { useMove, useWall } from '../core/turn'

// MOVE, WALL :: ActionType
// ActionType is 1 bit.
const MOVE = 0
const WALL = 1

// actionTypeSize :: Number
// The number of bits the action type data requires.
const actionTypeSize = 1

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
  String.fromCharCode(MOVE | moveDirection(game, point) << actionTypeSize)

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
  return moveMap[decodeChar(notation) >> actionTypeSize](location)
}

// encodeUseWall :: Wall -> Notation Wall
// Encodes the wall in 1 byte:
// * The action type (1 bit).
// * A wall can only be placed at 64 (8 x 8) locations (6 bits).
// * A wall can be vertical or horizontal (1 bit).
export const encodeUseWall = (wall) => {
  const topLeft = R.head(wall.points)
  const p = encodeWallPoint(isVertical(wall) ? south(west(topLeft)) : topLeft)
  return String.fromCharCode(
    WALL |
    (isVertical(wall) ? 1 : 0) << actionTypeSize |
    p << (actionTypeSize + 1))
}

// decodeUseWall :: Notation Wall -> Wall
export const decodeUseWall = (notation) => {
  const byte = decodeChar(notation)
  const isVertical = (byte >> actionTypeSize) & 1
  const rawPoint = decodeWallPoint(byte >> (actionTypeSize + 1))
  const topLeft = isVertical ? north(east(rawPoint)) : rawPoint
  return isVertical ? vwall(topLeft) : hwall(topLeft)
}

// encodeWallPoint :: Point -> Number
// Converts a wall point to a byte.
// Unlike a normal point, a wall point is bounded 0 <= r, c <= 8
export const encodeWallPoint = (point) => point.col + (point.row * 8)

// decodeWallPoint :: Number -> Point
// Converts the provided byte to a Point.
// Unlike a normal point, a wall point is bounded 0 <= r, c <= 8
export const decodeWallPoint = (n) => {
  const row = Math.floor(n / 8)
  const col = n - (row * 8)
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
      return 1
    default:
      throw "Encountered invalid action type: " + actionType
  }
}
