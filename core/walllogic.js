import * as R from 'ramda'
import {
  playerWinLocationsLens,
  players,
  playerLocation,
  isPointInbounds,
  unblocked,
} from './game'
import { wallPoints } from './wall'
import {
  north,
  south,
  east,
  west,
  nedge,
  sedge,
  eedge,
  wedge,
  ncoord,
  scoord,
  ecoord,
  wcoord,
} from './point'
import { middle } from '../util'

// isWallInbounds :: Game -> Wall -> Boolean
// Checks whether the entire wall is on the board.
export const isWallInbounds =
  R.curry((game, wall) => R.all(isPointInbounds(game), wallPoints(wall)))

// isWallSpaceOccupied :: Game -> Wall -> Boolean
// Checks if another wall already occupies the desired space.
export const isWallSpaceOccupied =
  R.curry((game, wall) => R.any(isWallOverlapping(wall), game.board.walls))

// isWallOverlapping :: Wall -> Wall -> Boolean
// Checks if the two walls overlap.
export const isWallOverlapping =
  R.curry((w1, w2) => {
    const p1 = wallPoints(w1)
    const p2 = wallPoints(w2)
    return (
      R.not(R.isEmpty(R.intersection(middle(p1), middle(p2)))) ||
      R.length(R.intersection(p1, p2)) >= 2)
  })

// isGameCompletable :: Game -> Boolean
// Checks whether every player can reach a win location.
export const isGameCompletable =
  (game) => R.all(R.apply(hasPath(game)), R.toPairs(game.board.players))

// hasPath :: Game -> PlayerId -> Player -> Boolean
// Checks whether the player can reach a win location.
const hasPath =
  R.curry((game, playerId, player) => {
    const start = playerLocation(game, playerId)
    const stops = R.view(playerWinLocationsLens(playerId), game)
    return isReachable(game, start, stops, playerId)
  })

// isReachable :: Game -> Point -> [Point] -> Boolean
// Checks whether an unblocked path from the start point to any stop point exists.
const isReachable = R.curry((game, start, stops, playerId) => {
  const _dfs = (toVisit, visited) => {
    if (R.isEmpty(toVisit)) {
      return false
    }
    const cur = R.head(toVisit)
    if (R.includes(cur, stops)) {
      return true
    }

    return _dfs(
      R.concat(unvisitedNeighbours(game, cur, visited), R.tail(toVisit)),
      R.append(cur, visited))
  }

  return _dfs([start], [])
})

// unvisitedNeighbours :: Game -> Point -> [Point] -> [Point]
// Returns a list of unvisited neighbours that are on the board.
const unvisitedNeighbours =
  R.curry((game, point, visitedPoints) =>
    R.reject(
      R.anyPass([
        R.equals(point),
        R.complement(isPointInbounds(game)),
        R.includes(R.__, visitedPoints),
      ]),
      unblockedNeighbours(game, point)))

// unblockedNeighbours :: Game -> Point -> [Point]
// Returns the neighbouring points that are not blocked by a wall.
const unblockedNeighbours = R.curry((game, point) => {
  const _unblocked = unblocked(game)
  return R.juxt([
    R.when(_unblocked(nedge), north),
    R.when(_unblocked(sedge), south),
    R.when(_unblocked(eedge), east),
    R.when(_unblocked(wedge), west),
  ])(point)
})
