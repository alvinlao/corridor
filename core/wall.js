import * as R from 'ramda'
import { east, south } from './point'

export const wall = (topLeft, orientation) => ({ topLeft, orientation })
export const hwall = (topLeft) => wall(topLeft, 'h')
export const vwall = (topLeft) => wall(topLeft, 'v')

// isVertical :: Wall -> Boolean
// Checks if the wall is vertically orientated.
export const isVertical = R.compose(R.equals('v'), R.prop('orientation'))

// isHorizontal :: Wall -> Boolean
// Checks if the wall is horizontally orientated.
export const isHorizontal = R.compose(R.equals('h'), R.prop('orientation'))

// wallPoints :: Wall -> [Point]
// Returns the points the provided wall occupies.
export const wallPoints = (wall) => {
  return R.reject(
    R.isNil,
    [
      wall.topLeft,
      isHorizontal(wall) ? east(wall.topLeft) : null,
      isVertical(wall) ? south(wall.topLeft) : null,
    ])
}
