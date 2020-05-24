import * as R from 'ramda'
import { east, south } from './point'
import { iterate } from '../util'

// wall :: Orientation -> Point -> Wall
// Creates a wall using the provided point as the top-left corner and in
// the provided orientation.
export const wall =
  R.curry((orientation, topLeft) => ({
    orientation,
    points: iterate(3, wallDirection(orientation), topLeft),
  }))

export const vwall = wall('v')
export const hwall = wall('h')

// isVertical :: Wall -> Boolean
// Checks if the wall is vertically orientated.
export const isVertical = R.compose(R.equals('v'), R.prop('orientation'))

// isHorizontal :: Wall -> Boolean
// Checks if the wall is horizontally orientated.
export const isHorizontal = R.compose(R.equals('h'), R.prop('orientation'))

// wallPoints :: Wall -> [Point]
// Returns the points the provided wall occupies.
export const wallPoints = R.prop('points')

// wallDirection :: Orientation -> (Point -> Point)
// Maps the orientation to a directional point function.
const wallDirection = R.cond([
  [R.equals('v'), R.always(south)],
  [R.equals('h'), R.always(east)],
])

// wallEdges : [Wall] -> [[Point]]
// Returns all edges that are blocked by walls.
export const wallEdges = (walls) => R.unnest(R.map(edges, walls))

// edges :: Wall -> [[Point]]
// Returns a list of edges that are blocked by this wall.
const edges = (wall) => R.zip(wall.points, R.tail(wall.points)) 
