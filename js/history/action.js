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

// decodeChar :: Char -> Number
export const decodeChar = (char) => char.charCodeAt()

// encodeInit :: Number -> Notation Init
// Notation a :: [Byte] :: String
// Encodes the initialize game action into 1 byte.
export const encodeInit = (numPlayers) =>
  String.fromCharCode(numPlayers)

// decodeInit :: Notation Init -> Number
export const decodeInit = decodeChar

// encodeUseMove :: Point -> Notation Point
// Encodes the move into 1 byte.
export const encodeUseMove = (point) =>
  String.fromCharCode(MOVE | encodePoint(point) << actionTypeSize)

// decodeUseMove :: Notation Move -> Point
export const decodeUseMove = (notation) =>
  decodePoint(decodeChar(notation) >> actionTypeSize)

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
export const decodeAction = (notation) => 
  applyAction(notation, decodeActionType(decodeChar(notation)))

// applyAction :: Notation -> ActionType -> Game -> Game
// Applies the encoded action to the provided game.
const applyAction = R.curry((notation, actionType, game) => {
  switch (actionType) {
    case MOVE:
      return useMove(game, decodeUseMove(notation))
    case WALL:
      return useWall(game, decodeUseWall(notation))
    default:
      return game
  }
})
