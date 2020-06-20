import * as R from 'ramda'
import Konva from 'konva/lib/Core'
import { Rect } from 'konva/lib/shapes/Rect'
import { Star } from 'konva/lib/shapes/Star'

import {
  updateBoard,
  hasPlayer,
  getPlayerIdOn,
  playerWinLocations,
} from '../../core/game'
import { point } from '../../core/point'
import { isGameOver, isPlayerInWinLocation } from '../../core/logic'
import { memoIsValidMove } from '../../core/memo'
import { putPlayer } from '../../core/board'

import { move } from '../../store/actions'
import { store } from '../../store/store'
import { present } from '../../store/undoable'

import {
  boardWidth,
  cellBackgroundColor,
  playerColors,
  white,
} from './constants'
import { tweenOpacity, tweenFill } from './animation'


// margin :: Number
// Percentage of the cell allocated for right margin.
const margin = 0.22

// iconOpacity :: Number
// Opacity of the player icon overlay.
const iconOpacity = 0.5

// cellSize, cellMargin :: Context -> Number
// Calculates the cell's size/margin.
export const cellSize = (context) => (1 - margin) * (boardWidth / 9.5)
export const cellMargin = (context) => margin * (boardWidth / 9.5)
export const offsetX = (context) =>
  ((cellSize(context) + cellMargin(context))/ 4) + (cellMargin(context) / 2)
    + ((context.stage.width() - boardWidth) / 2)

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
    shadowColor: "#000000",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowOpacity: 0.3,
    shadowBlur: 10,
    shadowEnabled: false,
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
  const game = present(state.game)
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
      const game = present(store.getState().game)
      if (memoIsValidMove(game, point, game.id) && !isGameOver(game)) {
        store.dispatch(move(game, point))
        document.body.style.cursor = 'default';
      }
    })
  shapes.bg.on(
    'mouseover',
    () => {
      const game = present(store.getState().game)
      if (memoIsValidMove(game, point, game.id) && !isGameOver(game)) {
        document.body.style.cursor = 'pointer';
        tweenOpacity(shapes.bg, 1, 120)
      }
    })
  shapes.bg.on(
    'mouseout',
    () => {
      const game = present(store.getState().game)
      if (memoIsValidMove(game, point, game.id) && !isGameOver(game)) {
        document.body.style.cursor = 'default';
        tweenOpacity(shapes.bg, 0.3, 240)
      }
    })
})

// updateColor :: Point -> Shape -> Game -> ()
const updateColor = (point, background, game) => {
  if (hasPlayer(game, point)) {
    background.opacity(1)
    background.fill(playerColors[getPlayerIdOn(game, point)])
    background.shadowEnabled(true)
  } else if (
      memoIsValidMove(game, point, game.id)
      && !isGameOver(game)) {
    background.opacity(0.3)
    background.fill(playerColors[game.activePlayerId])
    background.shadowEnabled(false)
  } else {
    background.opacity(1)
    background.fill(cellBackgroundColor)
    background.shadowEnabled(false)
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
    ])(playerDirection(getPlayerIdOn(game, point), game))
  }
}

// updateWinner :: Point -> Shape -> Game -> ()
const updateWinner = (point, shapes, game) => {
  if (
      hasPlayer(game, point)
      && isPlayerInWinLocation(game, getPlayerIdOn(game, point))) {
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
const playerDirection = (playerId, game) =>
  R.cond([
    [R.includes(point(8, 4)), R.always('up')],
    [R.includes(point(0, 4)), R.always('down')],
    [R.includes(point(4, 0)), R.always('left')],
    [R.includes(point(4, 8)), R.always('right')],
  ])(playerWinLocations(playerId))
