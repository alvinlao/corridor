import * as R from 'ramda'
import { putWall } from './board'
import {
  updateBoard,
  wallsAvailable,
  consumeWall,
  nextPlayersTurn,
} from './game'
import { isValidWall } from './logic'


// useWall :: Game -> Wall -> Game
// The active player places a wall in the game.
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
