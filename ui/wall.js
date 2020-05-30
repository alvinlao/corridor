import * as R from 'ramda'
import * as Konva from 'konva'
import { updateBoard, hasWall, wallsAvailable } from '../core/game'
import { point } from '../core/point'
import { isValidWall } from '../core/logic'
import { useWall } from '../core/turn'
import { putWall } from '../core/board'
import { hwall, vwall } from '../core/wall'
import { cellSize, cellMargin, cellX, cellY } from './cell'


const wallColor = "#776f69"
const invalidWallColor = "#FB3640"
const margin = 0.15
const wallMargin = (context) => margin * (2 * cellSize(context))
const wallLength = (context) =>
  (1 - margin) * (2 * cellSize(context)) + cellMargin(context)

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

const update = R.curry((context, wall, shape, game) => {
  updateOpacity(wall, shape, game)
  shape.fill(wallColor).zIndex(0)
})

const bind = R.curry((context, wall, shape, getGame, updateGame) => {
  const hoverState = { isHover: false }

  shape.on(
    'click',
    () => {
      if (wallsAvailable(getGame()) && isValidWall(getGame(), wall)) {
        updateGame(useWall(getGame(), wall))
      }
    })
  shape.on(
    'mouseover',
    () => {
      hoverState.isHover = true
      setTimeout(mouseover(hoverState, context, wall, shape, getGame), 15)
    })
  shape.on(
    'mouseout',
    () => {
      hoverState.isHover = false
      draw(context, () => update(context, wall, shape, getGame()))
    })
})

const updateOpacity = R.curry((wall, shape, game) => {
  if (hasWall(game, wall)) {
    shape.opacity(1)
  } else {
    shape.opacity(0)
  }
})

const mouseover = (hoverState, context, wall, shape, getGame) => () => {
  if (!hoverState.isHover) {
    return
  }
  draw(
    context,
    () => {
      if (!wallsAvailable(getGame())) {
        return
      }
      if (isValidWall(getGame(), wall)) {
        shape.opacity(1)
      } else {
        shape.opacity(0.5).fill(invalidWallColor).zIndex(127)
      }
    })
}

const draw = (context, f) => {
  f()
  context.layer.draw()
}
