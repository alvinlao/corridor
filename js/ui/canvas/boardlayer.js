import * as R from 'ramda'
import * as Konva from 'konva'

import { point } from '/js/core/point'
import { row, playerIds, playerLocation } from '/js/core/game'

import { initLayer } from './layer'
import { topMargin } from './constants'
import { initCell, offsetX } from './cell'
import { initHwall, initVwall } from './wall'

// initBoard :: Context -> Game -> [Element]
// Initializes board ui elements.
export const initBoard = R.curry((context, game) =>
  initLayer(
    context,
    boardLayer(context),
    R.concat(initCells(context, game), initWalls(context, game))))

// boardLayer :: Context -> Konva.Layer
const boardLayer = (context) => (
  new Konva.Layer({
    x: offsetX(context),
    y: topMargin,
  }))

// initCells :: Context -> Game -> [Element]
// Initializes cell ui elements.
const initCells = R.curry((context, game) =>
  R.map(initCell(context, game), flatMatrix(9, 9, 0)))

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
