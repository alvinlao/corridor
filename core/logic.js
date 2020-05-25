import * as R from 'ramda'
import { putWall } from './board'
import { updateBoard, playerIds, playerLocation, playerWinLocations } from './game'
import { moves } from './movementlogic'
import {
  isWallInbounds,
  isWallSpaceOccupied,
  isGameCompletable,
} from './walllogic'


// isValidMove :: Game -> PlayerId -> Point -> Boolean
// Checks whether the provided move is valid for the player.
export const isValidMove = R.curry((game, playerId, location) =>
  R.includes(location, moves(game, playerId)))

// isValidWall :: Game -> Wall -> Boolean
// Checks whether the provided wall can be placed.
export const isValidWall =
  R.allPass([
    isWallInbounds,
    R.complement(isWallSpaceOccupied),
    (game, wall) => isGameCompletable(updateBoard(putWall(wall), game)),
  ])

// winners :: Game -> [PlayerId]
// Returns players that are in their win locations.
export const winners = (game) => 
  R.filter(isPlayerInWinLocation(game), playerIds(game))

// isGameOver :: Game -> Boolean
// Checks whether the game is over.
export const isGameOver = (game) => R.not(R.isEmpty(winners(game)))

// isPlayerInWinLocation :: Game -> PlayerId -> Boolean
// Checks whether the player is in a win location.
const isPlayerInWinLocation = R.curry((game, playerId) => {
  const start = playerLocation(game, playerId)
  const stop = playerWinLocations(game, playerId)
  return R.includes(start, stop)
})
