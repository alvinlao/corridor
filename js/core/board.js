import * as R from 'ramda'
import { player } from './player'
import { point } from './point'

// board :: () -> Board
// Creates an empty board.
export const board = () => ({
  walls: [],
  players: {},
})

// putWall :: Wall -> Board -> Board
// Puts the provided wall on the board.
export const putWall = R.curry((wall, board) =>
  R.over(R.lensProp('walls'), R.append(wall), board))

// putPlayer :: PlayerId -> Point -> Board -> Board
// Puts the player at the provided location on the board.
export const putPlayer = R.curry((playerId, destination, board) =>
  R.set(R.lensPath(['players', playerId]), player(destination), board))
