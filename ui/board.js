import * as R from 'ramda'
import * as Konva from 'konva'
import { initCell } from './cell'
import { initHwall, initVwall } from './wall'
import { point } from '../core/point'
import { row, playerIds, playerLocation } from '../core/game'
import { addElements, attachLayer } from './util'

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
    y: (window.innerHeight - context.size) / 2 - (context.size / 2),
  })
  context.stage.add(layer)
  return layer
})

// initCells :: Context -> Game -> [Element]
// Initializes cell ui elements.
const initCells = R.curry((context, game) =>
  R.map(
    initCell(context, game),
    flatMatrix(9, 9, 0)))

// initWalls :: Context -> Game -> [Element]
// Initializes wall ui elements.
const initWalls = R.curry((context, game) => 
  R.concat(
    R.map(initHwall(context, game), flatMatrix(8, 8, 0)),
    R.map(initVwall(context, game), flatMatrix(9, 9, 1))))

// flatMatrix :: Number -> Number -> Number -> [Point]
// Creates a flat matrix of size rows x cols.
const flatMatrix = R.curry((rows, cols, offset) =>
  R.unnest(
    R.map(
      R.apply(point),
      R.xprod(R.range(offset, rows), R.range(offset, cols)))))
