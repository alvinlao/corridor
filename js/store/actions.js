import { store } from './store'
import { useMove, useWall } from '../core/turn'
import { encodeUseMove, encodeUseWall } from '../serialize/turn'


// INIT, MOVE, WALL :: String
// Action type.
export const INIT = 'INIT'
export const MOVE = 'MOVE'
export const WALL = 'WALL'

// init :: Game -> Action
export const init = (game) => ({
  type: INIT,
  game,
})

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
