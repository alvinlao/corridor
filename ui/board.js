import * as R from 'ramda'
import * as Konva from 'konva'
import { initCell } from './cell'
import { row, playerIds, playerLocation } from '../core/game'

// initBoard :: Context -> Game -> [Element]
// Initializes a board ui element.
export const initBoard = R.curry((context, game) => {
  const cells = 
    R.pipe(
      R.map(row),
      R.unnest,
      R.map(initCell(context, game)))
    (R.range(0, 9))
  const layer = initLayer(context, cells)

  R.pipe(
    R.map(R.prop('shapes')),
    R.unnest,
    R.forEach(s => layer.add(s)))
  (cells)

  return cells
})

const initLayer = R.curry((context, cells) => {
  const layer = new Konva.Layer({
    x: (window.innerWidth - context.size) / 2,
    y: (window.innerHeight - context.size) / 2,
  })
  context.stage.add(layer)
  return layer
})
