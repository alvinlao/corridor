import * as R from 'ramda'
import { board, putPlayer } from './board'
import { point } from './point'
import { edges } from './wall'

const rows = 9
const cols = 9
const winLocations = () => ({
  0: row(8),
  1: row(0),
  2: col(8),
  3: col(0),
})
const initializePlayers = [
  putPlayer(0, point(0, 4)),
  putPlayer(1, point(8, 4)),
  putPlayer(2, point(4, 0)),
  putPlayer(3, point(4, 8)),
]

// game :: Number -> Game
// Creates a new game.
export const game = (numPlayers) => ({
  board: setupPlayers(numPlayers, board()),
  playerWinLocations: winLocations(),
  rows,
  cols,
})

// setupPlayers :: Number -> Board -> Board
// Places all the players on the board in their staring positions.
const setupPlayers = (numPlayers, board) => 
  R.reduce(
    R.applyTo,
    board,
    R.take(numPlayers, initializePlayers))

// row :: Number -> [Point]
// Returns a list of points in the provided row number.
export const row =
  (n) => R.map(point(n), R.range(0, cols))

// col :: Number -> [Point]
// Returns a list of points in the provided col number.
export const col =
  (n) => R.map(point(R.__, n), R.range(0, rows))

// isPointInbounds :: Game -> Point -> Boolean
// Checks whether the point is on the game.
export const isPointInbounds =
  R.curry((game, point) =>
    (
      point.row >= 0 &&
      point.row < game.rows &&
      point.col >= 0 &&
      point.col < game.cols
    ))

// updateBoard :: (Board -> Board) -> Game -> Game
// Updates the board in the game.
export const updateBoard = R.over(R.lensProp('board'))

// playerIds :: Game -> [PlayerId]
// Returns all the player ids.
export const playerIds = (game) => R.map(parseInt, R.keys(game.board.players))

// playerWinLocations :: Game -> PlayerId -> [Point]
// Returns the player's win locations.
export const playerWinLocations = R.curry((game, playerId) =>
  R.view(
    R.lensPath(['playerWinLocations', playerId]),
    game))

// playerLocation :: Game -> PlayerId -> Point
// Returns the player's location.
export const playerLocation = R.curry((game, playerId) =>
  R.view(
    R.lensPath(['board', 'players', playerId, 'location']),
    game))

// hasPlayer :: Game -> Point -> Boolean
// Checks whether the space is occupied by a player.
export const hasPlayer = R.curry((game, point) =>
  R.pipe(
    R.map(playerLocation(game)),
    R.includes(point))
  (playerIds(game)))

// hasWall :: Game -> [Point] -> Boolean
// Checks if the edge is occupied by a wall
export const hasWall = R.curry((game, edge) =>
  R.pipe(
    R.map(edges),
    R.unnest,
    R.includes(edge))
  (game.board.walls))

// unblocked :: Game -> (Point -> [Point]) -> Point -> Boolean
// Checks if the edge relative to the provided point is unblocked.
export const unblocked =
  R.curry((game, pointToEdge, point) => R.not(hasWall(game, pointToEdge(point))))
