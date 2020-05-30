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
import { playerColors, white } from './constants'


const backgroundColor = "#EBE1DA"
const margin = 0.20

export const cellSize = (context) => (1 - margin) * (context.boardSize / 9)
export const cellMargin = (context) => margin * (context.boardSize / 9)

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
    fill: backgroundColor,
    strokeWidth: 0,
    cornerRadius: 5,
  }))

const triangle = (context, point) => (
  new Konva.RegularPolygon({
    x: cellX(context, point) + cellSize(context) / 2,
    y: cellY(context, point) + cellSize(context) / 2,
    width: cellSize(context) * 0.5,
    height: cellSize(context) * 0.5,
    sides: 3,
    fill: "#000000",
    strokeWidth: 0,
  }))

// initCell :: Context -> Game -> Point -> [Element]
export const initCell = R.curry((context, game, point) => {
  const bg = cell(context, point)
  const up = triangle(context, point).listening(false)
  const down = triangle(context, point).rotate(180).listening(false)
  const left = triangle(context, point).rotate(-90).listening(false)
  const right = triangle(context, point).rotate(90).listening(false)
  up.y(up.y() + 1)
  down.y(down.y() - 1)
  left.x(left.x() + 1)
  right.x(right.x() - 1)

  const shapes = {
    bg,
    up,
    down,
    left,
    right,
  }

  return {
    shapes: [bg, up, down, left, right],
    bind: bind(context, point, shapes),
    update: update(context, point, shapes),
  }
})

const update = R.curry((context, point, shapes, game) => {
  updateDirection(point, shapes, game)
  updateColor(point, shapes.bg, game)
})

const bind = R.curry((context, point, shapes, getGame, updateGame) => {
  shapes.bg.on(
    'click',
    () => updateGame(useMove(getGame(), point)))
  shapes.bg.on(
    'mouseover',
    draw(context, () => {
      if (isValidMove(getGame(), getGame().activePlayerId, point)) {
        shapes.bg.opacity(shapes.bg.opacity() * 0.5)
      }
    }))
  shapes.bg.on(
    'mouseout',
    draw(context, () => {
      updateColor(point, shapes.bg, getGame())
    }))
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
    cell.fill(backgroundColor)
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

const draw = (context, f) =>
  () => {
    f()
    context.layer.draw()
  }
