import * as R from 'ramda'
import { east, south } from './point'
import { iterate } from '../util/iterables'

// vwall :: Point -> Wall
// Creates a vertical wall using the provided point as the top point.
export const vwall = (point) => ({ points: iterate(3, south, point) })

// hwall :: Point -> Wall
// Creates a horizontal wall using the provided point as the left point.
export const hwall = (point) => ({ points: iterate(3, east, point) })

// points :: Wall -> [Point]
// Returns the points the provided wall occupies.
export const points = R.prop('points')

// edges :: Wall -> [Edge]
// Edge :: [Point]
// Returns edges that are occupied by this wall.
export const edges = (wall) => R.zip(wall.points, R.tail(wall.points)) 

// edgeKey :: [Point] -> String
// Converts an edge to a string.
export const edgeKey = (edge) => {
  const a = R.head(edge)
  const b = R.last(edge)
  return a.row + ',' + a.col + ',' + b.row + ',' + b.col
}

// wallKey :: Wall -> String
// Converts a wall to a string.
export const wallKey = R.compose(R.map(edgeKey), edges)

// isVertical :: Wall -> Boolean
// Checks if the provided wall is vertically orientated.
export const isVertical = (wall) => R.equals(wall, vwall(R.head(wall.points)))
