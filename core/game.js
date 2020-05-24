import * as R from 'ramda'
import { board, putPlayer } from './board'
import { point } from './point'

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
  putPlayer(3, point(8, 0)),
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

const boardLens = R.lensProp('board')

export const updateBoard = R.over(boardLens)

export const playerLocationLens = (playerId) =>
  R.lensPath(['board', 'players', playerId, 'location'])

export const playerWinLocationsLens = (playerId) =>
  R.lensPath(['playerWinLocations', playerId])
