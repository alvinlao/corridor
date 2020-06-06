 import * as R from 'ramda'
import { board, putPlayer } from './board'
import { point } from './point'
import { edges, edgeKey, wallKey } from './wall'


const rows = 9
const cols = 9

// row :: Number -> [Point]
// Returns a list of points in the provided row number.
const row = (n) => R.map(point(n), R.range(0, cols))

// col :: Number -> [Point]
// Returns a list of points in the provided col number.
const col = (n) => R.map(point(R.__, n), R.range(0, rows))

// winLocations :: {PlayerId: [Point]}
const winLocations = {
  0: row(8),
  1: row(0),
  2: col(8),
  3: col(0),
}

// initializePlayers :: [(Board -> Board)]
const initializePlayers = [
  putPlayer(0, point(0, 4)),
  putPlayer(1, point(8, 4)),
  putPlayer(2, point(4, 0)),
  putPlayer(3, point(4, 8)),
]

// _playerIds :: [PlayerId]
const _playerIds = [0, 1, 2, 3]

// turnOrder :: [PlayerId]
export const turnOrder = [1, 3, 0, 2]

// ids :: Number -> [PlayerId]
// Returns a list of player ids for the given number of players.
export const ids = (numPlayers) => R.take(numPlayers, _playerIds)

// game :: Number -> Game
// Creates a new game.
export const game = (numPlayers) => ({
  board: setupPlayers(numPlayers, board()),
  numPlayers,
  rows,
  cols,
  inventory: setupInventory(numPlayers),
  activePlayerId: firstPlayerId(numPlayers),
  wallsPerPlayer: wallsPerPlayer(numPlayers),
})

// wallsPerPlayer :: Number -> Number
// Returns the number of walls each player starts with.
export const wallsPerPlayer = (numPlayers) => numPlayers == 2 ? 10 : 5

// setupPlayers :: Number -> Board -> Board
// Places all the players on the board in their staring positions.
const setupPlayers = (numPlayers, board) => 
  R.reduce(
    R.applyTo,
    board,
    R.take(numPlayers, initializePlayers))

// setupInventory :: Number -> Inventory
// Gives each player a preset number of walls.
const setupInventory = (numPlayers) => {
  const numWalls = wallsPerPlayer(numPlayers)
  return R.pipe(
    R.map((playerId) => [playerId, numWalls]),
    R.fromPairs)
  (R.range(0, numPlayers))
}

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

// playerWinLocations :: PlayerId -> [Point]
// Returns the player's win locations.
export const playerWinLocations = (playerId) => winLocations[playerId]

// playerLocation :: Game -> PlayerId -> Point
// Returns the player's location.
export const playerLocation = R.curry((game, playerId) =>
  R.view(
    R.lensPath(['board', 'players', playerId, 'location']),
    game))

// getPlayer :: Game -> Point -> PlayerId
// Gets the player id that is on this point.
export const getPlayer = R.curry((game, point) =>
  R.head(
    R.filter(
      (playerId) => R.equals(point, playerLocation(game, playerId)),
      playerIds(game))))

// hasPlayer :: Game -> Point -> Boolean
// Checks whether the space is occupied by a player.
export const hasPlayer = R.curry((game, point) =>
  R.pipe(
    R.map(playerLocation(game)),
    R.includes(point))
  (playerIds(game)))

// hasWall :: Game -> Wall -> Boolean
// Checks whether the wall exists in the game.
export const hasWall = R.curry((game, wall) =>
  R.includes(wall, game.board.walls))

// edgeOccupied :: Game -> [Point] -> Boolean
// Checks if the edge is occupied by a wall
export const edgeOccupied = R.curry((game, edge) =>
  gameWallEdges(game).has(edgeKey(edge)))

// unblocked :: Game -> (Point -> [Point]) -> Point -> Boolean
// Checks if the edge relative to the provided point is unblocked.
export const unblocked = R.curry((game, pointToEdge, point) =>
  R.not(edgeOccupied(game, pointToEdge(point))))

// nextPlayersTurn :: Game -> Game
// Updates the game to be the next player's turn.
export const nextPlayersTurn = (game) =>
  R.over(
    R.lensProp('activePlayerId'),
    (playerId) => {
      const order = R.filter(R.includes(R.__, playerIds(game)), turnOrder)
      const nextPlayerIndex =
        R.inc(R.indexOf(playerId, order)) % game.numPlayers
      return R.nth(nextPlayerIndex, order)
    },
    game)

// numWallsAvailable :: Game -> PlayerId -> Number
// Returns the number of walls the player has available.
export const numWallsAvailable = R.curry((game, playerId) =>
  R.view(R.lensPath(['inventory', playerId]), game))

// wallsAvailable :: Game -> Boolean
// Checks if the active player has walls available.
export const wallsAvailable = (game) =>
  numWallsAvailable(game, game.activePlayerId) > 0

// consumeWall :: Game -> Game
// Removes a wall from the active player's inventory.
export const consumeWall = (game) =>
  R.over(R.lensPath(['inventory', game.activePlayerId]), R.dec, game)

// gameWallEdges :: Game -> Set String
// Returns a list of wall edges in the game.
const gameWallEdges = R.memoizeWith(
  (game) => R.map(wallKey, game.board.walls),
  (game) =>
    new Set(
      R.pipe(
        R.path(['board', 'walls']),
        R.map(edges),
        R.unnest,
        R.map(edgeKey))
      (game)))

const firstPlayerId = (numPlayers) =>
  R.head(R.filter(R.includes(R.__, R.take(numPlayers, _playerIds)), turnOrder))
