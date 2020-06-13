import * as R from 'ramda'
import * as Konva from 'konva'
import debounce from 'lodash.debounce'

import { store } from '/js/store/store'
import { goto } from '/js/store/timetravel'

import { topMargin, cellBackgroundColor } from './constants'
import { cellSize, cellMargin } from './cell'

const x = (context) => context.stage.width() - 10
const height = (context) => (
  ((cellSize(context) + cellMargin(context)) * 9)
  - cellMargin(context))
const offsetY = 60
const handleRadius = 8

const timeline = (context) => (
  new Konva.Line({
    points: [
      x(context),
      offsetY,
      x(context),
      height(context) + offsetY,
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
      y: height(context) + offsetY,
      radius: handleRadius,
      fill: "#000000",
      opacity: 1,
      draggable: true,
      dragBoundFunc: (pos) => ({
        x: x(context),
        y: R.clamp(topMargin, height(context) + topMargin, pos.y),
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
  shapes.handle.on('mouseover', () => document.body.style.cursor = 'pointer')
  shapes.handle.on('mouseout', () => document.body.style.cursor = 'default')
  shapes.handle.on(
    'dragmove',
    debounce(
    () => {
      const y = shapes.handle.y() - offsetY
      const h = height(context)
      const ratio = (y / h)
      const index = Math.round(
          ratio * (store.getState().game.history.length - 1))
      store.dispatch(goto(index))
    }, 50))
})

const update = R.curry((context, shapes, state) => {
  const numStates = state.game.history.length - 1
  const index = state.game.index
  if (numStates < 1) {
    shapes.handle.hide()
  } else {
    shapes.handle.show()
    const ratio = numStates == 0 ? 0 : (index / numStates)
    shapes.handle.y((height(context) * ratio) + offsetY)
  }
})
