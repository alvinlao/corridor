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

  // _dispatchGoto :: Number -> ()
  // Dispatches a goto action.
  const _dispatchGoto = debounce((index) => store.dispatch(goto(index)), 100)

  shapes.handle.on(
    'dragmove',
    () => {
      const numStates = store.getState().game.history.length
      const ratio = handleRatio(context, shapes.handle.y())
      const index = Math.round(ratio * (numStates - 1))

      // Snap handle.
      shapes.handle.y(handleYPosition(context, numStates, index))

      // Jump to the requested index.
      _dispatchGoto(index)
    })
})

const update = R.curry((context, shapes, state) => {
  const numStates = state.game.history.length
  const index = state.game.index
  if (numStates <= 1) {
    shapes.handle.hide()
  } else {
    shapes.handle.show()
    shapes.handle.y(handleYPosition(context, numStates, index))
  }
})

// guide :: Context -> Number -> Number -> Number
// Returns the closest absolute y position that maps to a state.
const guide = R.curry((context, y, numStates) =>
  R.reduce(
    R.minBy(yPosition => Math.abs(y - yPosition)),
    Infinity,
    R.times(handleYPosition(context, numStates), numStates)))

// handleYPosition :: Context -> Number -> Number -> Number
// Given a state index, returns the handle's absolute y position on the
// timeline.
const handleYPosition = R.curry((context, numStates, index) => {
  const ratio = numStates <= 1 ? 0 : (index / (numStates - 1))
  return (height(context) * ratio) + offsetY
})

// handleRatio :: Context -> Number -> Number
// Given a handle position, returns the position to height ratio.
const handleRatio = R.curry((context, y) => (y - offsetY) / height(context))
