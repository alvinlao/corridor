import * as R from 'ramda'
import { useMove, useWall } from '../core/turn'
import { encodeReset, encodeUseMove, encodeUseWall } from '../serialize/turn'

import { store } from './store'
import { reset as _reset } from './timetravel'


// MOVE, WALL :: String
// Action type.
export const MOVE = 'MOVE'
export const WALL = 'WALL'

// reset :: Game -> Action
// Adds a reset notation to the time travel reset action.
export const reset = (game) =>
  R.set(R.lensProp('notation'), encodeReset(game.numPlayers), _reset(game))

// move :: Game -> Point -> Action
// Creates an action that moves the active player to the provided
// location.
export const move = (game, point) => {
  return {
    type: MOVE,
    game: useMove(game, point),
    notation: encodeUseMove(point),
  }
}

// placeWall :: Game -> Wall -> Action
// Creates an action that places a wall for the active player
// at the provided location.
export const placeWall = (game, wall) => {
  return {
    type: WALL,
    game: useWall(game, wall),
    notation: encodeUseWall(wall),
  }
}
