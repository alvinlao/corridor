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
