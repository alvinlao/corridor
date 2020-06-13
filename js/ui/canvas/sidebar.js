import * as R from 'ramda'
import * as Konva from 'konva'

import { topMargin, cellBackgroundColor } from './constants'
import { cellSize, cellMargin } from './cell'

const x = (context) => context.stage.width() - 10
const height = (context) => (
  ((cellSize(context) + cellMargin(context)) * 9)
  - cellMargin(context)
  + offsetY)
const offsetY = 60
const handleRadius = 8

const timeline = (context) => (
  new Konva.Line({
    points: [
      x(context),
      offsetY,
      x(context),
      height(context),
    ],
    strokeWidth: 2,
    stroke: cellBackgroundColor,
    opacity: 1,
    hitStrokeWidth: 10,
  }))

const handle = R.curry(
  (context) => (
    new Konva.Circle({
      x: x(context),
      y: offsetY,
      radius: handleRadius,
      strokeWidth: 1.5,
      stroke: "#000000",
      fill: "#000000",
      opacity: 1,
      draggable: true,
      dragBoundFunc: (pos) => ({
        x: x(context),
        y: R.clamp(topMargin, height(context) + topMargin - offsetY, pos.y),
      }),
    })))

// initSidebar :: Context -> [Element]
// Initializes a sidebar ui element.
export const initSidebar = R.curry((context) => {
  const shapes = {
    timeline: timeline(context),
    handle: handle(context),
  }

  bind(context, shapes)

  return {
    shapes: R.values(shapes),
    update: update(context, shapes),
  }
})

const bind = R.curry((context, shapes) => {
})

const update = R.curry((context, shapes, state) => {
  const numStates = state.game.history.length - 1
  const index = state.game.index
  const ratio = numStates == 0 ? 0 : 1 - (index / numStates)
  shapes.handle.y(((height(context) - offsetY) * ratio) + offsetY)
})
