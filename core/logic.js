import * as R from 'ramda'
import { updateBoard } from './game'
import { wallPoints, wallEdges } from './wall'
import { north, south, east, west, nedge, sedge, eedge, wedge, } from './point'
import { middle } from '../util'

// isWallInbounds :: Game -> Wall -> Boolean
// Checks whether the entire wall is on the board.
export const isWallInbounds =
  R.curry((game, wall) => R.all(isPointInbounds(game), wallPoints(wall)))

// isPointInbounds :: Game -> Point -> Boolean
// Checks whether the point is on the game.
const isPointInbounds =
  R.curry((game, point) =>
    (
      point.row >= 0 &&
      point.row < game.rows &&
      point.col >= 0 &&
      point.col < game.cols
    ))

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
  (game) => R.all(
    R.identity,
    R.map(
      R.apply(hasPath(game)),
      R.toPairs(game.board.players)))

// hasPath :: Game -> PlayerId -> Player -> Boolean
// Checks whether the player can reach the other side.
const hasPath = R.curry((game, playerId, player) => {
  const start =
    R.view(
      R.lensPath(['board', 'players', playerId, 'location']),
      game)
  const stops = R.view(R.lensPath(['playerWinLocations', playerId]), game)
  return isReachable(game, start, stops)
})

// isReachable :: Game -> Point -> [Point] -> Boolean
// Checks whether an unblocked path from the start point to any stop point exists.
const isReachable = R.curry((game, start, stops) => {
  const _dfs = (toVisit, visited) => {
    if (R.isEmpty(toVisit)) {
      return false
    }
    const cur = R.head(toVisit)
    if (R.includes(cur, stops)) {
      return true
    }

    return _dfs(
      R.concat(
        unvisitedNeighbours(game, cur, visited),
        R.tail(toVisit)),
      R.append(cur, visited))
  }

  return _dfs([start], [])
})

// unvisitedNeighbours :: Game -> Point -> [Point] -> [Point]
// Returns a list of unvisited neighbours that are on the board.
const unvisitedNeighbours = R.curry((game, point, visitedPoints) => {
  const blockedEdges = wallEdges(game.board.walls)
  const free = f => R.complement(R.compose(R.includes(R.__, blockedEdges), f))
  const unblockedNeighbours = R.juxt([
    R.when(free(nedge), north),
    R.when(free(sedge), south),
    R.when(free(eedge), east),
    R.when(free(wedge), west),
  ])
    
  return R.reject(
    R.anyPass(
      [
        R.equals(point),
        R.complement(isPointInbounds(game)),
        R.includes(R.__, visitedPoints),
      ]),
    unblockedNeighbours(point))
})

// isValidWall :: Game -> Wall -> Boolean
// Checks whether the provided wall can be placed.
export const isValidWall =
  R.allPass([
    isWallInbounds,
    R.complement(isWallSpaceOccupied),
    (game, wall) => isGameCompletable(updateBoard(putWall(wall), game)),
  ])
