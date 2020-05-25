import * as R from 'ramda'
import { board, putPlayer } from './board'
import { point } from './point'
import { wallEdges } from './wall'

const rows = 9
const cols = 9
const playerWinLocations = () => ({
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
  playerWinLocations: playerWinLocations(),
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

const boardLens = R.lensProp('board')

// updateBoard :: (Board -> Board) -> Game -> Game
// Updates the board in the game.
export const updateBoard = R.over(boardLens)

// playerLocationLens :: PlayerId -> Lens Game
// Creates a lens that focus on the provided player's location.
export const playerLocationLens = (playerId) =>
  R.lensPath(['board', 'players', playerId, 'location'])

// playerWinLocationsLens :: PlayerId -> Lens Game
// Creates a lens that focus on the provided player's win locations.
export const playerWinLocationsLens = (playerId) =>
  R.lensPath(['playerWinLocations', playerId])

// playerIds :: Game -> [PlayerId]
// Returns all the player ids.
export const playerIds = (game) => R.map(parseInt, R.keys(game.board.players))

// playerLocation :: Game -> PlayerId -> Point
// Returns the player's location.
export const playerLocation =
  R.curry((game, playerId) => R.view(playerLocationLens(playerId), game))

// playerLocations :: Game -> [Point]
// Returns the location of each player.
export const playerLocations =
  (game) => R.map(playerLocation(game), playerIds(game))

// hasPlayer :: Game -> Point -> Boolean
// Checks whether the space is occupied by a player.
export const hasPlayer =
  R.curry((game, point) => R.includes(point, playerLocations(game)))

// hasWall :: Game -> [Point] -> Boolean
// Checks if the edge has a wall.
export const hasWall =
  R.curry((game, edge) => R.includes(edge, wallEdges(game.board.walls)))

// unblocked :: Game -> (Point -> [Point]) -> Point -> Boolean
// Checks if the edge relative to the provided point is unblocked.
export const unblocked =
  R.curry((game, pointToEdge, point) => R.not(hasWall(game, pointToEdge(point))))
