import * as R from 'ramda'
import * as Konva from 'konva'
import { updateBoard, hasWall, wallsAvailable } from '../core/game'
import { point } from '../core/point'
import { isValidWall } from '../core/logic'
import { useWall } from '../core/turn'
import { putWall } from '../core/board'
import { hwall, vwall } from '../core/wall'
import { cellSize, cellMargin, cellX, cellY } from './cell'
import { wallColor } from './constants'
import { tweenOpacity, tweenFill } from './util'


const invalidWallColor = "#FB3640"
const margin = 0.15
const wallMargin = (context) => margin * (2 * cellSize(context))
const wallLength = (context) =>
  (1 - margin) * (2 * cellSize(context)) + cellMargin(context)
const tweenDuration = 120

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
      0,
      0,
      (wallLength(context) / 2) - (cellMargin(context) / 2),
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
      0,
      cellMargin(context),
      (wallLength(context) / 2) - (cellMargin(context) / 2))
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
  return {
    shapes: [shape],
    bind: bind(context, wall, shape),
    update: update(context, wall, shape),
  }
})

const update = R.curry((context, wall, shape, gameStatesHelper) => {
  const game = gameStatesHelper.current()
  updateOpacity(wall, shape, game)
  tweenFill(shape, wallColor, tweenDuration)
  shape.zIndex(0)
})

const bind = R.curry((context, wall, shape, gameStatesHelper) => {
  const hoverState = { isHover: false }

  shape.on(
    'click',
    () => {
      const game = gameStatesHelper.current()
      if (wallsAvailable(game) && isValidWall(game, wall)) {
        gameStatesHelper.push(useWall(game, wall))
      }
    })
  shape.on(
    'mouseover',
    () => {
      hoverState.isHover = true
      setTimeout(mouseover(hoverState, context, wall, shape, gameStatesHelper), 15)
    })
  shape.on(
    'mouseout',
    () => {
      hoverState.isHover = false
      draw(context, () => update(context, wall, shape, gameStatesHelper))
    })
})

const updateOpacity = R.curry((wall, shape, game) => {
  if (hasWall(game, wall)) {
    tweenOpacity(shape, 1, tweenDuration)
  } else {
    tweenOpacity(shape, 0, tweenDuration)
  }
})

const mouseover = (hoverState, context, wall, shape, gameStatesHelper) => () => {
  if (!hoverState.isHover) {
    return
  }
  draw(
    context,
    () => {
      const game = gameStatesHelper.current()
      if (!wallsAvailable(game)) {
        return
      }
      if (isValidWall(game, wall)) {
        tweenOpacity(shape, 1, tweenDuration)
      } else {
        shape.opacity(0.5).fill(invalidWallColor).zIndex(127)
      }
    })
}

const draw = (context, f) => {
  f()
  context.layer.draw()
}
