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

// iterate :: Number -> (a -> a) -> a -> [a]
// Creates a list of size N where the first item is calculated by
// applying the function on the input value, and the second item is
// calculated by applying the function on the first item and so on.
const iterate = (n, f, v) => {
  const _iterate = (n, f, v, vs) => {
    if (n <= 0) {
      return vs
    } else {
      return _iterate(n - 1, f, f(v), R.append(f(v), vs))
    }
  }

  return _iterate(n - 1, f, v, [v])
}

// wallPoints :: Wall -> [Point]
// Returns the points the provided wall occupies.
export const wallPoints = (wall) =>
  R.reject(
    R.isNil,
    R.flatten([
      isVertical(wall) ? iterate(3, south, wall.topLeft) : [],
      isHorizontal(wall) ? iterate(3, east, wall.topLeft)  : [],
    ]))
