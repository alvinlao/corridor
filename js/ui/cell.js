import * as R from 'ramda'
import * as Konva from 'konva'

import {
  updateBoard,
  hasPlayer,
  getPlayer,
  playerWinLocations,
} from '../core/game'
import { point } from '../core/point'
import { isValidMove, isGameOver, isPlayerInWinLocation } from '../core/logic'
import { putPlayer } from '../core/board'

import { move } from '../store/actions'
import { store } from '../store/store'

import { cellBackgroundColor, playerColors, white } from './constants'
import { tweenOpacity, tweenFill } from './util'


// margin :: Number
// Percentage of the cell allocated for right margin.
const margin = 0.20

// iconOpacity :: Number
// Opacity of the player icon overlay.
const iconOpacity = 0.5

// cellSize, cellMargin :: Context -> Number
// Calculates the cell's size/margin.
export const cellSize = (context) => (1 - margin) * (context.stage.width() / 9)
export const cellMargin = (context) => margin * (context.stage.width() / 9)

// cellX, cellY :: Context -> Point -> Number
// Calculates the cell's x/y positions.
export const cellX = (context, point) =>
  ((cellSize(context) + cellMargin(context)) * point.col)
export const cellY = (context, point) =>
  ((cellSize(context) + cellMargin(context)) * (8 - point.row))

// background :: Context -> Point -> Konva.Shape
// Creates the cell's background shape.
const background = (context, point) => (
  new Konva.Rect({
    x: cellX(context, point),
    y: cellY(context, point),
    width: cellSize(context),
    height: cellSize(context),
    fill: cellBackgroundColor,
    strokeWidth: 0,
    cornerRadius: 5,
    opacity: 1,
  }))

// arrow :: Context -> Point -> Konva.Shape
// Creates an arrow shape used to indicate a player's
// travel direction.
const arrow = (context, point) => (
  new Konva.Shape({
    x: cellX(context, point) + cellSize(context) / 2,
    y: cellY(context, point) + cellSize(context) / 2,
    stroke: "#000000",
    width: cellSize(context) * 0.45,
    height: cellSize(context) * 0.225,
    opacity: iconOpacity,
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

// star :: Context -> Point -> Konva.Shape
// Creates an star shape used for the winning player.
const star = (context, point) => (
  new Konva.Star({
    x: cellX(context, point) + cellSize(context) / 2,
    y: cellY(context, point) + cellSize(context) / 2,
    stroke: "#000000",
    fill: "#000000",
    width: cellSize(context),
    height: cellSize(context),
    opacity: iconOpacity,
    numPoints: 5,
    innerRadius: 10,
    outerRadius: 5,
  }))

// initCell :: Context -> Game -> Point -> [Element]
// A cell represents a space on the game board.
export const initCell = R.curry((context, game, point) => {
  const shapes = {
    bg: background(context, point),
    up: arrow(context, point).listening(false).hide(),
    down: arrow(context, point).rotate(180).listening(false).hide(),
    left: arrow(context, point).rotate(-90).listening(false).hide(),
    right: arrow(context, point).rotate(90).listening(false).hide(),
    star: star(context, point).rotate(180).listening(false).hide(),
  }
  bind(context, point, shapes)

  return {
    shapes: R.values(shapes),
    update: update(context, point, shapes),
  }
})

// update :: Context -> Point -> [Shape] -> State -> ()
// Updates the provided shapes to reflect the given state.
const update = R.curry((context, point, shapes, state) => {
  const game = state.game.present
  updateDirection(point, shapes, game)
  updateColor(point, shapes.bg, game)
  updateWinner(point, shapes, game)
})

// bind :: Context -> Point -> [Shape] -> ()
// Binds event listeners to the shapes.
const bind = R.curry((context, point, shapes) => {
  shapes.bg.on(
    'click',
    () => {
      const game = store.getState().game.present
      if (isValidMove(game, game.activePlayerId, point) && !isGameOver(game)) {
        store.dispatch(move(game, point))
      }
    })
  shapes.bg.on(
    'mouseover',
    () => {
      const game = store.getState().game.present
      if (isValidMove(game, game.activePlayerId, point) && !isGameOver(game)) {
        tweenOpacity(shapes.bg, 1, 120)
      }
    })
  shapes.bg.on(
    'mouseout',
    () => {
      const game = store.getState().game.present
      if (isValidMove(game, game.activePlayerId, point) && !isGameOver(game)) {
        tweenOpacity(shapes.bg, 0.3, 240)
      }
    })
})

// updateColor :: Point -> Shape -> Game -> ()
const updateColor = (point, background, game) => {
  if (hasPlayer(game, point)) {
    background.opacity(1)
    background.fill(playerColors[getPlayer(game, point)])
  } else if (
      isValidMove(game, game.activePlayerId, point)
      && !isGameOver(game)) {
    background.opacity(0.3)
    background.fill(playerColors[game.activePlayerId])
  } else {
    background.opacity(1)
    background.fill(cellBackgroundColor)
  }
}

// updateDirection :: Point -> Shape -> Game -> ()
const updateDirection = (point, shapes, game) => {
  resetArrow(shapes)
  if (hasPlayer(game, point)) {
    R.cond([
      [R.equals('up'), () => shapes.up.show()],
      [R.equals('down'), () => shapes.down.show()],
      [R.equals('left'), () => shapes.left.show()],
      [R.equals('right'), () => shapes.right.show()],
    ])(playerDirection(getPlayer(game, point), game))
  }
}

// updateWinner :: Point -> Shape -> Game -> ()
const updateWinner = (point, shapes, game) => {
  if (
      hasPlayer(game, point) 
      && isPlayerInWinLocation(game, getPlayer(game, point))) {
    resetArrow(shapes)
    shapes.star.show()
  } else {
    shapes.star.hide()
  }
}

const resetArrow = (shapes) => {
  shapes.up.hide()
  shapes.down.hide()
  shapes.left.hide()
  shapes.right.hide()
}

// playerDirection :: PlayerId -> Game -> Direction
// Direction :: String
const playerDirection = (playerId, game) => {
  return R.cond([
    [R.includes(point(8, 4)), R.always('up')],
    [R.includes(point(0, 4)), R.always('down')],
    [R.includes(point(4, 0)), R.always('left')],
    [R.includes(point(4, 8)), R.always('right')],
  ])(playerWinLocations(playerId))
}
