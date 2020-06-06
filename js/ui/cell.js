import * as R from 'ramda'
import * as Konva from 'konva'

import {
  updateBoard,
  hasPlayer,
  getPlayer,
  playerWinLocations,
} from '../core/game'
import { point } from '../core/point'
import { isValidMove } from '../core/logic'
import { useMove } from '../core/turn'
import { putPlayer } from '../core/board'

import { push } from '../store/actions'
import { store } from '../store/store'

import { cellColor, playerColors, white } from './constants'
import { tweenOpacity, tweenFill } from './util'


const margin = 0.20

export const cellSize = (context) => (1 - margin) * (context.size / 9)
export const cellMargin = (context) => margin * (context.size / 9)

export const cellX = (context, point) =>
  ((cellSize(context) + cellMargin(context)) * point.col)
export const cellY = (context, point) =>
  ((cellSize(context) + cellMargin(context)) * (8 - point.row))

const cell = (context, point) => (
  new Konva.Rect({
    x: cellX(context, point),
    y: cellY(context, point),
    width: cellSize(context),
    height: cellSize(context),
    fill: cellColor,
    strokeWidth: 0,
    cornerRadius: 5,
    opacity: 1,
  }))

const arrow = (context, point) => (
  new Konva.Shape({
    x: cellX(context, point) + cellSize(context) / 2,
    y: cellY(context, point) + cellSize(context) / 2,
    stroke: "#000000",
    width: cellSize(context) * 0.45,
    height: cellSize(context) * 0.225,
    sceneFunc: (cx, shape) => {
      const width = shape.getAttr('width') / 2
      const height = shape.getAttr('height')
      cx.beginPath()
      cx.moveTo(-width, height / 2)
      cx.lineTo(0, -height / 2)
      cx.lineTo(width, height / 2)
      cx.fillStrokeShape(shape)
    },
  }))

// initCell :: Context -> Game -> Point -> [Element]
export const initCell = R.curry((context, game, point) => {
  const shapes = {
    bg: cell(context, point),
    up: arrow(context, point).listening(false),
    down: arrow(context, point).rotate(180).listening(false),
    left: arrow(context, point).rotate(-90).listening(false),
    right: arrow(context, point).rotate(90).listening(false),
  }
  bind(context, point, shapes)

  return {
    shapes: R.values(shapes),
    update: update(context, point, shapes),
  }
})

const update = R.curry((context, point, shapes, state) => {
  const game = state.game.present
  updateDirection(point, shapes, game)
  updateColor(point, shapes.bg, game)
})

const bind = R.curry((context, point, shapes) => {
  shapes.bg.on(
    'click',
    () => {
      const game = store.getState().game.present
      if (isValidMove(game, game.activePlayerId, point)) {
        store.dispatch(push(useMove(game, point)))
      }
    })
  shapes.bg.on(
    'mouseover',
    () => {
      const game = store.getState().game.present
      if (isValidMove(game, game.activePlayerId, point)) {
        tweenOpacity(shapes.bg, 1, 120)
      }
    })
  shapes.bg.on(
    'mouseout',
    () => {
      const game = store.getState().game.present
      if (isValidMove(game, game.activePlayerId, point)) {
        tweenOpacity(shapes.bg, 0.3, 240)
      }
    })
})

const updateColor = (point, cell, game) => {
  if (hasPlayer(game, point)) {
    cell.opacity(1)
    cell.fill(playerColors[getPlayer(game, point)])
  } else if (isValidMove(game, game.activePlayerId, point)) {
    cell.opacity(0.3)
    cell.fill(playerColors[game.activePlayerId])
  } else {
    cell.opacity(1)
    cell.fill(cellColor)
  }
}

const updateDirection = (point, shapes, game) => {
  const onOpacity = 0.3
  shapes.up.opacity(0)
  shapes.down.opacity(0)
  shapes.left.opacity(0)
  shapes.right.opacity(0)
  if (hasPlayer(game, point)) {
    R.cond([
      [R.equals('up'), () => shapes.up.opacity(onOpacity)],
      [R.equals('down'), () => shapes.down.opacity(onOpacity)],
      [R.equals('left'), () => shapes.left.opacity(onOpacity)],
      [R.equals('right'), () => shapes.right.opacity(onOpacity)],
    ])(playerDirection(getPlayer(game, point), game))
  }
}

const playerDirection = (playerId, game) => {
  return R.cond([
    [R.includes(point(8, 4)), R.always('up')],
    [R.includes(point(0, 4)), R.always('down')],
    [R.includes(point(4, 0)), R.always('left')],
    [R.includes(point(4, 8)), R.always('right')],
  ])(playerWinLocations(game, playerId))
}
