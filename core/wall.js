import * as R from 'ramda'
import { east, south } from './point'
import { iterate } from '../util/util'

// vwall :: Point -> Wall
// Creates a vertical wall using the provided point as the top point.
export const vwall = (point) => ({ points: iterate(3, south, point) })

// hwall :: Point -> Wall
// Creates a horizontal wall using the provided point as the left point.
export const hwall = (point) => ({ points: iterate(3, east, point) })

// points :: Wall -> [Point]
// Returns the points the provided wall occupies.
export const points = R.prop('points')

// edges :: Wall -> [[Point]]
// Returns edges that are occupied by this wall.
export const edges = (wall) => R.zip(wall.points, R.tail(wall.points)) 
