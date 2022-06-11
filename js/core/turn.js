import * as R from 'ramda'
import { putWall, putPlayer } from './board'
import {
  updateBoard,
  wallsAvailable,
  numWallsAvailable,
  consumeWall,
  playerIds,
  turnOrder,
} from './game'
import { isValidWall, isValidMove } from './logic'
import { moves } from './movementlogic'
import { cycle } from '../util/iterables'


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
    isValidMove(R.__, destination),
    R.pipe(
      updateBoard(putPlayer(game.activePlayerId, destination)),
      nextPlayersTurn))
  (game))

// nextPlayersTurn :: Game -> Game
// Updates the game to be the next player's turn. The next player is guaranteed
// to have a valid move.
export const nextPlayersTurn = (game) =>
  R.over(
    R.lensProp('activePlayerId'),
    (playerId) =>
      R.pipe(
        playerIds,
        turnOrder,
        cycle(2),
        R.dropWhile(R.complement(R.equals(playerId))),
        R.drop(1),
        R.dropWhile(R.complement(hasActionAvailable(game))),
        R.head)
      (game),
    game)

// hasActionAvailable :: Game -> PlayerId -> Boolean
// Returns true if the player has an action available. An action is available
// if the player has a wall to place or a valid move.
const hasActionAvailable = R.curry((game, playerId) =>
  numWallsAvailable(game, playerId) > 0 ||
  R.not(R.isEmpty(moves(game, playerId))))
