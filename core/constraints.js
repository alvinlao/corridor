import * as R from 'ramda'
import { wallPoints } from './wall'

// isWallInbounds :: Board -> Wall -> Boolean
// Checks whether the wall is on the board.
export const isWallInbounds =
  R.curry((board, wall) => R.all(isPointInbounds(board), wallPoints(wall)))

// isPointInbounds :: Board -> Point -> Boolean
// Checks whether the point is on the board.
const isPointInbounds =
  R.curry((board, point) =>
    (
      point.row >= 0 &&
      point.row < board.rows &&
      point.col >= 0 &&
      point.col < board.cols
    ))

// isWallSpaceOccupied :: Board -> Wall -> Boolean
// Checks if another wall already occupies the desired space.
export const isWallSpaceOccupied =
  R.curry((board, wall) => R.any(isWallOverlapping(wall), board.walls))

// isWallOverlapping :: Wall -> Wall -> Boolean
// Checks if the two walls overlap.
export const isWallOverlapping =
  R.curry((w1, w2) => {
    const p1 = wallPoints(w1)
    const p2 = wallPoints(w2)
    return R.equals(p1[1], p2[1]) || R.length(R.intersection(p1, p2)) >= 2
  })
