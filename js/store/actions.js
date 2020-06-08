import * as R from 'ramda'
import { useMove, useWall } from '../core/turn'
import { encodeReset, encodeUseMove, encodeUseWall } from '../serialize/action'

import { store } from './store'
import { RESET } from './timetravel'


// MOVE, WALL :: String
// Action type.
export const MOVE = 'MOVE'
export const WALL = 'WALL'

// reset :: Game -> Action
// Adds a reset notation to the time travel reset action.
export const reset = (game) => ({
  type: RESET,
  game,
  notation: encodeReset(game.numPlayers),
})

// move :: Game -> Point -> Action
// Creates an action that moves the active player to the provided
// location.
export const move = (game, point) => ({
  type: MOVE,
  game: useMove(game, point),
  notation: encodeUseMove(game, point),
})

// placeWall :: Game -> Wall -> Action
// Creates an action that places a wall for the active player
// at the provided location.
export const placeWall = (game, wall) => ({
  type: WALL,
  game: useWall(game, wall),
  notation: encodeUseWall(wall),
})
