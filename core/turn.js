import * as R from 'ramda'
import { putWall, putPlayer } from './board'
import {
  updateBoard,
  wallsAvailable,
  consumeWall,
  nextPlayersTurn,
} from './game'
import { isValidWall, isValidMove } from './logic'


// useWall :: Game -> Wall -> Game
// Places a wall in the game on behalf of the active player.
export const useWall = R.curry((game, wall) =>
  R.when(
    R.allPass([wallsAvailable, isValidWall(R.__, wall)]),
    R.pipe(
      updateBoard(putWall(wall)),
      consumeWall,
      nextPlayersTurn))
  (game))


// useMove :: Game -> Point -> Game
// Moves the active player to the destination.
export const useMove = R.curry((game, destination) =>
  R.when(
    isValidMove(R.__, game.activePlayerId, destination),
    R.pipe(
      updateBoard(putPlayer(game.activePlayerId, destination)),
      nextPlayersTurn))
  (game))
