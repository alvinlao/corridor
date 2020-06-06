import * as R from 'ramda'
import * as Konva from 'konva'
import { playerColors, white } from './constants'
import { wallsPerPlayer, numWallsAvailable } from '../core/game'

const rowLimit = 5
const wallSymbolWidth = 5
const wallSymbolHeight = 14
const wallSymbolMargin = 4
const hudWidth = (context, numPlayers) => (context.size / numPlayers)

const playerWall = R.curry(
  (context, numPlayers, index, playerId, totalWalls, wallId) => (
    new Konva.Rect({
      x: (
        (hudWidth(context, numPlayers) * index)
        + (hudWidth(context, numPlayers) / 2)
        - ((rowLimit * (wallSymbolWidth + wallSymbolMargin)) / 2)
        + (wallId % rowLimit) * (wallSymbolMargin + wallSymbolWidth)),
      y: (
        context.size
        + 25
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
  const walls = R.map(
    playerWall(context, numPlayers, index, playerId, totalWalls),
    R.range(0, totalWalls))

  return {
    shapes: walls,
    bind: R.identity,
    update: update(context, numPlayers, playerId, { walls }),
  }
})

const update = R.curry(
  (context, numPlayers, playerId, shapes, gameStatesHelper) => {
    const game = gameStatesHelper.current()
    R.addIndex(R.map)(
      (shape, index) => {
        if (numPlayers != game.numPlayers) {
          hide(shape)
        } else {
          updateVisibility(shape, index, numWallsAvailable(game, playerId))
        }
      },
      shapes.walls)
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
