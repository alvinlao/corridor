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
// Place a wall in the game on behalf of the active player.
export const useWall = R.curry((game, wall) =>
  R.when(
    R.allPass([
      isValidWall(R.__, wall),
      wallsAvailable,
    ]),
    R.pipe(
      updateBoard(putWall(wall)),
      consumeWall,
      nextPlayersTurn))
  (game))


// useMove :: Game -> Point -> Game
// Moves the active player to the destination.
export const useMove = R.curry((game, point) =>
  R.when(
    isValidMove(R.__, game.activePlayerId, point),
    R.pipe(
      updateBoard(putPlayer(game.activePlayerId, point)),
      nextPlayersTurn))
  (game))