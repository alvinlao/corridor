import * as R from 'ramda'
import { point } from '../core/point'
import { vwall, hwall, isVertical } from '../core/wall'
import { useMove, useWall } from '../core/turn'

// MOVE, WALL :: TurnType
// TurnType is a single bit.
const MOVE = 0
const WALL = 1

// encodeUseMove :: Point -> SerializedTurn
// Encodes the move into a single ASCII character.
export const encodeUseMove = (point) => encodeTurn(MOVE, encodePoint(point))

// encodeUseWall :: Wall -> SerializedTurn
// Encodes the wall into a single ASCII character.
export const encodeUseWall = (wall) => encodeTurn(WALL, encodeWall(wall))

// encodePoint :: Point -> Number
// Converts a point to 6 bits.
export const encodePoint = (point) => point.row | point.col << 3

// decodePoint :: Number -> Point
// Converts the provided 6 bits to a point.
export const decodePoint = (n) => {
  const row = n & 7
  const col = (n >> 3) & 7
  return point(row, col)
}

// encodeWall :: Wall -> Number
// Converts a wall to 7 bits.
export const encodeWall = (wall) =>
  encodePoint(R.head(wall.points)) << 1 | (isVertical(wall) ? 1 : 0)

// decodeWall :: Number -> Point
// Converts the provided 7 bits to a wall.
export const decodeWall = (n) => {
  const isVertical = n & 1
  const topLeft = decodePoint(n >> 1)
  return isVertical ? vwall(topLeft) : hwall(topLeft)
}

// encodeTurn :: TurnType -> Number -> SerializedTurn
// Encodes the payload and turn type into a single ASCII character.
const encodeTurn = (type, payload) =>
  String.fromCharCode(payload << 1 | type)

// decodeTurn :: SerializedTurn -> (Game -> Game)
// Decodes the ASCII character into a function that applies
// the encoded move to the given Game.
export const decodeTurn = (serializedTurn) => {
  const n = serializedTurn.charCodeAt()
  const type = n & 1
  const payload = n >> 1

  return (game) => {
    if (type === MOVE) {
      return useMove(game, decodePoint(payload))
    } else if (type == WALL) {
      return useWall(game, decodeWall(payload))
    } else {
      return game
    }
  }
}
