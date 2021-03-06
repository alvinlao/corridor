import * as R from 'ramda'
import Konva from 'konva/lib/Core'
import { Rect } from 'konva/lib/shapes/Rect'

import { updateBoard, hasWall, wallsAvailable } from '../../core/game'
import { point } from '../../core/point'
import { isValidWall, isGameOver } from '../../core/logic'
import { putWall } from '../../core/board'
import { hwall, vwall } from '../../core/wall'

import { placeWall } from '../../store/actions'
import { store } from '../../store/store'
import { present } from '../../store/undoable'

import { cellSize, cellMargin, cellX, cellY } from './cell'
import { wallColor } from './constants'
import { tweenOpacity, tweenFill } from './animation'


const invalidWallColor = "#FB3640"
const margin = 0.15
const wallMargin = (context) => margin * (2 * cellSize(context))
const wallLength = (context) =>
  (1 - margin) * (2 * cellSize(context)) + cellMargin(context)
const tweenDuration = 0

const hwallShape = (context, point) => {
  const r = new Konva.Rect({
    x: cellX(context, point) + (wallMargin(context) * 0.5),
    y: cellY(context, point) - cellMargin(context),
    width: wallLength(context),
    height: cellMargin(context),
    fill: wallColor,
    strokeWidth: 0,
    cornerRadius: 5,
    opacity: 0,
  })
  r.hitFunc((cx) => {
    cx.beginPath()
    cx.rect(
      -(wallMargin(context) * 0.5),
      0,
      (cellSize(context) + wallMargin(context) * 0.25),
      cellMargin(context))
    cx.closePath()
    cx.fillStrokeShape(r)
  })
  return r
}

const vwallShape = (context, point) => {
  const r = new Konva.Rect({
    x: cellX(context, point) - cellMargin(context),
    y: cellY(context, point) + (wallMargin(context) * 0.5),
    width: cellMargin(context),
    height: wallLength(context),
    fill: wallColor,
    strokeWidth: 0,
    cornerRadius: 5,
    opacity: 0,
  })
  r.hitFunc((cx) => {
    cx.beginPath()
    cx.rect(
      0,
      -(wallMargin(context) * 0.5),
      cellMargin(context),
      (cellSize(context) + wallMargin(context) * 0.25))
    cx.closePath()
    cx.fillStrokeShape(r)
  })
  return r
}

// initHwall :: Context -> Game -> Point -> [Element]
export const initHwall = R.curry((context, game, point) => {
  const wall = hwall(point)
  const shape = hwallShape(context, point)
  return {
    shapes: [shape],
    bind: bind(context, wall, shape),
    update: update(context, wall, shape),
  }
})

// initVwall :: Context -> Game -> Point -> [Element]
export const initVwall = R.curry((context, game, point) => {
  const wall = vwall(point)
  const shape = vwallShape(context, point)
  bind(context, wall, shape)

  return {
    shapes: [shape],
    update: update(context, wall, shape),
  }
})

const update =
  R.curry((context, wall, shape, state) => {
    const game = present(state.game)
    updateOpacity(wall, shape, game)
    tweenFill(shape, wallColor, tweenDuration)
  })

const bind = R.curry((context, wall, shape) => {
  const hoverState = { isHover: false }
  shape.on(
    'click',
    () => {
      const game = present(store.getState().game)
      if (wallsAvailable(game) && isValidWall(game, wall) && !isGameOver(game)) {
        store.dispatch(placeWall(game, wall))
      }
    })
  shape.on(
    'mouseover',
    () => {
      hoverState.isHover = true
      setTimeout(mouseover(hoverState, context, wall, shape), 0)
    })
  shape.on(
    'mouseout',
    () => {
      hoverState.isHover = false
      document.body.style.cursor = 'default';
      update(context, wall, shape, store.getState())
    })
})

const updateOpacity = R.curry((wall, shape, game) => {
  if (hasWall(game, wall)) {
    tweenOpacity(shape, 1, tweenDuration)
  } else {
    tweenOpacity(shape, 0, tweenDuration)
  }
})

const mouseover = (hoverState, context, wall, shape) => () => {
  if (!hoverState.isHover) {
    return
  }
  const game = present(store.getState().game)
  if (!wallsAvailable(game) || isGameOver(game)) {
    return
  }

  document.body.style.cursor = 'pointer';
  if (isValidWall(game, wall)) {
    tweenOpacity(shape, 1, tweenDuration)
  } else {
    shape.opacity(0.5).fill(invalidWallColor).moveToTop()
    shape.getParent().draw()
  }
}
