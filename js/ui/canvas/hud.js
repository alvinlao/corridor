import * as R from 'ramda'
import * as Konva from 'konva'

import { wallsPerPlayer, numWallsAvailable } from '../../core/game'
import { isGameOver, winners } from '../../core/logic'

import { present } from '../../store/undoable'

import { boardWidth, playerColors, white } from './constants'

const rowLimit = 5
const activePlayerSymbolRadius = 5;
const wallSymbolWidth = 5
const wallSymbolHeight = 18
const wallSymbolMargin = 4
const hudWidth = (context, numPlayers) => (boardWidth / numPlayers)

const activePlayerSymbol = R.curry(
  (context, numPlayers, index, totalWalls, playerId) => (
    new Konva.Circle({
      x: (
        (context.stage.width() - boardWidth) / 2
        + (hudWidth(context, numPlayers) * index)
        + (hudWidth(context, numPlayers) / 2)
        - wallSymbolMargin / 2),
      y: (
        boardWidth
        + 60
        + ((wallSymbolHeight + rowLimit) * Math.floor(totalWalls / rowLimit))
        + (wallSymbolHeight / 2)),
      radius: 5,
      strokeWidth: 1.5,
      stroke: playerColors[playerId],
      fill: playerColors[playerId],
      opacity: 1,
    })))

const playerWall = R.curry(
  (context, numPlayers, index, playerId, totalWalls, wallId) => (
    new Konva.Rect({
      x: (
        (context.stage.width() - boardWidth) / 2
        + (hudWidth(context, numPlayers) * index)
        + (hudWidth(context, numPlayers) / 2)
        - ((rowLimit * (wallSymbolWidth + wallSymbolMargin)) / 2)
        + (wallId % rowLimit) * (wallSymbolMargin + wallSymbolWidth)),
      y: (
        boardWidth
        + 60
        + ((wallSymbolHeight + rowLimit) * Math.floor(wallId / rowLimit))),
      width: wallSymbolWidth,
      height: wallSymbolHeight,
      fill: playerColors[playerId],
      cornerRadius: 5,
      opacity: 0,
    })))

// initHud :: Context -> Number -> [Element]
// Initializes a hud ui element.
export const initHud = R.curry((context, numPlayers, playerId, index) => {
  const totalWalls = wallsPerPlayer(numPlayers)
  const walls =
    R.times(
      playerWall(context, numPlayers, index, playerId, totalWalls),
      totalWalls)
  const activePlayer =
    activePlayerSymbol(context, numPlayers, index, totalWalls, playerId)

  return {
    shapes: R.concat(walls, [activePlayer]),
    update: update(
      context,
      numPlayers,
      playerId,
      { walls, activePlayer, }),
  }
})

const update = R.curry(
  (context, numPlayers, playerId, shapes, state) => {
    const game = present(state.game)
    const gameOver = isGameOver(game)
    R.addIndex(R.map)(
      (shape, index) => {
        if (numPlayers != game.numPlayers) {
          hide(shape)
        } else {
          updateVisibility(shape, index, numWallsAvailable(game, playerId))
          if (gameOver) {
            fade(shape)
          }
        }
      },
      shapes.walls)
    if (numPlayers != game.numPlayers) {
      hide(shapes.activePlayer)
    } else {
      show(shapes.activePlayer)
      shapes.activePlayer.fillEnabled(game.activePlayerId == playerId)
      if (gameOver) {
        fade(shapes.activePlayer)
        shapes.activePlayer.fillEnabled(R.includes(playerId, winners(game)))
      }
    }
  })

const updateVisibility = (shape, index, wallsAvailable) => {
  if (index < wallsAvailable) {
    shape.opacity(1)
  } else {
    shape.opacity(0.1)
  }
}

const hide = (shape) => {
  shape.opacity(0)
}

const show = (shape) => {
  shape.opacity(1)
}

const fade = (shape) => {
  shape.opacity(shape.opacity() * 0.5)
}
