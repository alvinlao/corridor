import * as R from 'ramda'
import * as Konva from 'konva'
import { initCell } from './cell'
import { initHwall, initVwall } from './wall'
import { point } from '../core/point'
import { row, playerIds, playerLocation } from '../core/game'

// initBoard :: Context -> Game -> [Element]
// Initializes a board ui element.
export const initBoard = R.curry((context, game) => {
  const cellLayer = initLayer(context)
  const cells = initCells(attachLayer(cellLayer, context), game)
  addElements(cells, cellLayer)

  const wallLayer = initLayer(context)
  const walls = initWalls(attachLayer(wallLayer, context), game)
  addElements(walls, wallLayer)

  return R.concat(cells, walls)
})

const initLayer = R.curry((context) => {
  const layer = new Konva.Layer({
    x: (window.innerWidth - context.size) / 2,
    y: (window.innerHeight - context.size) / 2,
  })
  context.stage.add(layer)
  return layer
})

// initCells :: Context -> Game -> [Element]
// Initializes cell ui elements.
const initCells = R.curry((context, game) => mapPoints(9, initCell(context, game)))

// initWalls :: Context -> Game -> [Element]
// Initializes wall ui elements.
const initWalls = R.curry((context, game) => 
  R.concat(
    R.map(initHwall(context, game), flatMatrix(8, 8, 0)),
    R.map(initVwall(context, game), flatMatrix(9, 9, 1))))

// shapes :: [Element] -> [[Shape]]
const shapes = R.map(R.prop('shapes'))

// mapPoints :: Number -> (Point -> a) -> a
const mapPoints = R.curry((n, f) => (
  R.pipe(
    R.range(0),
    R.map(row),
    R.unnest,
    R.map(f))
  (n)))

// flatMatrix :: Number -> Number -> Number -> [Point]
// Creates a flat matrix of size rows x cols.
const flatMatrix = R.curry((rows, cols, offset) =>
  R.unnest(
    R.map(
      R.apply(point),
      R.xprod(R.range(offset, rows), R.range(offset, cols)))))

// addElements :: [Element] -> Konva.Layer -> ()
const addElements = R.curry((elements, layer) =>
  R.pipe(
    shapes,
    R.unnest,
    R.forEach(s => layer.add(s)))
  (elements))

// attachLayer :: Konva.Layer -> Context -> Context
// Adds the layer to the context object.
const attachLayer = R.curry((layer, context) =>
  R.set(R.lensProp('layer'), layer, context))
