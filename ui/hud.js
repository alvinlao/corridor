import * as R from 'ramda'
import * as Konva from 'konva'
import { playerColors, white } from './constants'
import { numWallsAvailable } from '../core/game'

const rowLimit = 5
const wallSymbolWidth = 5
const wallSymbolHeight = 14
const wallSymbolMargin = 4
const hudWidth = (context, numPlayers) => (context.size / numPlayers)

const playerWall = R.curry((context, game, playerId, totalWalls, wallId) => (
  new Konva.Rect({
    x: (
      (hudWidth(context, game.numPlayers) * playerId)
      + (hudWidth(context, game.numPlayers) / 2)
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
  })))

// initHud :: Context -> Game -> [Element]
// Initializes a hud ui element.
export const initHud = R.curry((context, game, playerId) => {
  const totalWalls = numWallsAvailable(game, playerId)
  const walls = R.map(
    playerWall(context, game, playerId, totalWalls),
    R.range(0, totalWalls))

  return {
    shapes: walls,
    bind: R.identity,
    update: update(context, playerId, { walls }),
  }
})

const update = R.curry((context, playerId, shapes, game) => {
  R.addIndex(R.map)(
    (shape, index) =>
      updateVisibility(shape, index, numWallsAvailable(game, playerId)),
    shapes.walls)
})

const updateVisibility = (shape, index, wallsAvailable) => {
  if (index < wallsAvailable) {
    shape.opacity(1)
  } else {
    shape.opacity(0.1)
  }
}
