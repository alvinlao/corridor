import * as R from 'ramda'
import { putWall } from './board'
import {
  updateBoard,
  playerIds,
  playerLocation,
  playerWinLocations,
} from './game'
import { moves } from './movementlogic'
import {
  isWallInbounds,
  isWallSpaceOccupied,
  isGameCompletable,
} from './walllogic'


// isValidMove :: Game -> Point -> Boolean
// Checks whether the provided move is valid for the active player.
export const isValidMove = R.curry((game, location) =>
  R.includes(location, moves(game, game.activePlayerId)))

// isValidWall :: Game -> Wall -> Boolean
// Checks whether the provided wall can be placed.
export const isValidWall =
  R.allPass([
    isWallInbounds,
    R.complement(isWallSpaceOccupied),
    (game, wall) => isGameCompletable(updateBoard(putWall(wall), game)),
  ])

// isGameOver :: Game -> Boolean
// Checks whether the game is over.
export const isGameOver = (game) => R.not(R.isEmpty(winners(game)))

// winners :: Game -> [PlayerId]
// Returns the players that are in their win locations.
export const winners = (game) => 
  R.filter(isPlayerInWinLocation(game), playerIds(game))

// isPlayerInWinLocation :: Game -> PlayerId -> Boolean
// Checks whether the player is in a win location.
export const isPlayerInWinLocation = R.curry((game, playerId) =>
  R.includes(playerLocation(game, playerId), playerWinLocations(playerId)))
