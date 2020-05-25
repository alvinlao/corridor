import * as R from 'ramda'
import {
  playerLocations,
  playerLocation,
  isPointInbounds,
  unblocked,
  hasPlayer,
} from './game'
import { ncompass, scompass, ecompass, wcompass } from './point'

// moves :: PlayerId -> Game -> [Point]
// Returns a list of locations the player can move to.
export const moves = R.curry((playerId, game) => {
  const point = playerLocation(playerId, game)
  return R.pipe(
    R.juxt([
      movesInFront(ncompass),
      movesInFront(scompass),
      movesInFront(ecompass),
      movesInFront(wcompass),
    ]),
    R.unnest,
    R.uniq)(game, point)
})

// movesInFront :: Compass -> Game -> Point -> [Point]
// Returns a list of locations in front of the player they can move to.
// Uses the provided compass to determine what is "in front".
// Diagram: The "o"s are candidate locations.
//   x o x
//   o o o
//   x P x
const movesInFront = R.curry((compass, game, point) =>
  R.pipe(
    R.juxt([
      R.when(canMoveUp(compass, game), compass.up),
      R.when(canJumpUp(compass, game), R.compose(compass.up, compass.up)),
      R.when(canJumpLeft(compass, game), R.compose(compass.up, compass.left)),
      R.when(canJumpRight(compass, game), R.compose(compass.up, compass.right)),
    ]),
    R.reject(R.equals(point)),
  )(point))

// canMoveUp :: Compass -> Game -> Point -> Boolean
// Checks whether a player can move into the space above them.
const canMoveUp = R.curry((compass, game, point) =>
  R.allPass([
    R.compose(isPointInbounds(game), compass.up),
    unblocked(game, compass.upedge), 
    R.complement(R.compose(hasPlayer(game), compass.up)),
  ])(point))

// canJumpUp :: Compass -> Game -> Point -> Boolean
// Checks whether a player can jump into the space 2 above them.
const canJumpUp = R.curry((compass, game, point) =>
  R.allPass([
    R.compose(isPointInbounds(game), R.compose(compass.up, compass.up)),
    unblocked(game, compass.upedge), 
    R.compose(unblocked(game, compass.upedge), compass.up),
    R.compose(hasPlayer(game), compass.up),
    R.complement(R.compose(hasPlayer(game), compass.up, compass.up)),
  ])(point))

// canJumpLeft :: Compass -> Game -> Point -> Boolean
// Checks whether a player can jump into the left diagonal space above them.
const canJumpLeft = R.curry((compass, game, point) =>
  R.allPass([
    R.compose(isPointInbounds(game), R.compose(compass.up, compass.left)),
    unblocked(game, compass.upedge), 
    R.compose(unblocked(game, compass.leftedge), compass.up),
    R.compose(hasPlayer(game), compass.up),
    R.complement(R.compose(hasPlayer(game), compass.up, compass.left)),
    R.anyPass([
      R.compose(hasPlayer(game), R.compose(compass.up, compass.up)),
      R.complement(R.compose(unblocked(game, compass.upedge), compass.up)),
    ]),
  ])(point))

// canJumpRight :: Compass -> Game -> Point -> Boolean
// Checks whether a player can jump into the right diagonal space above them.
const canJumpRight = R.curry((compass, game, point) =>
  R.allPass([
    R.compose(isPointInbounds(game), R.compose(compass.up, compass.right)),
    unblocked(game, compass.upedge), 
    R.compose(unblocked(game, compass.rightedge), compass.up),
    R.compose(hasPlayer(game), compass.up),
    R.complement(R.compose(hasPlayer(game), compass.up, compass.right)),
    R.anyPass([
      R.compose(hasPlayer(game), R.compose(compass.up, compass.up)),
      R.complement(R.compose(unblocked(game, compass.upedge), compass.up)),
    ]),
  ])(point))
