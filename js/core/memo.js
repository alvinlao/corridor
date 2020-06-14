import * as R from 'ramda'

import { moves } from './movementlogic'


// memoIsValidMove :: Game -> Point -> Boolean
// Memoized version of isValidMove that uses the Game's id as the cache key.
// Note: Only Game objects in the store have ids.
export const memoIsValidMove = R.curry((game, location) =>
  R.includes(location, memoMoves(game, game.activePlayerId)))

// memoMoves :: Game -> PlayerId -> [Point]
// Memoized version of moves that uses the Game's id as the cache key.
const memoMoves =
  R.memoizeWith((game, playerId) => game.id + R.toString(playerId), moves)
