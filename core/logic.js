import * as R from 'ramda'
import { putWall } from './board'
import {
  isWallInbounds,
  isWallSpaceOccupied,
  isGameCompletable,
} from './walllogic'
import {
  updateBoard,
  playerLocationLens,
  playerWinLocationsLens,
  players,
} from './game'


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
export const isGameOver =
  (game) =>  R.any(isPlayerInWinLocation(game), players(game)) 

// isPlayerInWinLocation :: Game -> PlayerId -> Boolean
// Checks whether the player is in a win location.
const isPlayerInWinLocation = R.curry((game, playerId) => {
  const start = R.view(playerLocationLens(playerId), game)
  const stop = R.view(playerWinLocationsLens(playerId), game)
  return R.includes(start, stop)
})
