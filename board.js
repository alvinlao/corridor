import _ from 'lodash'
import * as R from 'ramda'
import { Just, List } from 'monet'
import { north, south, east, west } from './point'
import { isVertical, isHorizontal } from './wall'
import { player } from './player'

// board :: BoardParams -> Board
// Creates an empty board.
export const board = (params) => ({
  rows: params.rows,
  cols: params.cols,
  walls: [],
  players: {},
})

// putWall :: Wall -> Board -> Board
// Puts the provided wall on the board.
export const putWall =
  R.curry((wall, board) => R.over(R.lensProp('walls'), R.append(wall), board))

// putPlayer :: PlayerId -> Point -> Board -> Board
// Puts the player at the provided location on the board.
export const putPlayer = 
  R.curry(
    (playerId, destination, board) =>
      R.set(
        R.lensPath(['players', playerId]),
        player(destination),
        board))
