 import * as R from 'ramda'
import { board, putPlayer } from './board'
import { point } from './point'
import { edges, edgeKey, wallKey } from './wall'
import { cycle } from '../util/iterables'


// rows, cols :: Number
// Defines the number of rows/cols in the game.
const rows = 9
const cols = 9

// row, col :: Number -> [Point]
// Returns a list of points in the provided row/col number.
const row = (n) => R.times(point(n, R.__), cols)
const col = (n) => R.times(point(R.__, n), rows)

// startingLocations :: {PlayerId: Point}
const startingLocations = {
  0: point(0, 4),
  1: point(8, 4),
  2: point(4, 0),
  3: point(4, 8),
}

// winLocations :: {PlayerId: [Point]}
const winLocations = {
  0: row(8),
  1: row(0),
  2: col(8),
  3: col(0),
}

// ids :: Number -> [PlayerId]
// Returns a list of player ids for the given number of players.
export const ids = (numPlayers) => R.take(numPlayers, [0, 1, 2, 3])

// turnOrder :: [PlayerId] -> [PlayerId]
// Given a list of player ids, returns them in turn order.
export const turnOrder = (playerIds) =>
  R.filter(R.includes(R.__, playerIds), [1, 3, 0, 2])

// game :: Number -> Game
// Creates a new game.
export const game = (numPlayers) => ({
  numPlayers,
  board: setupPlayers(numPlayers, board()),
  inventory: setupInventory(numPlayers),
  activePlayerId: firstPlayerId(numPlayers),
})

// firstPlayerId :: Number -> PlayerId
// Returns the player id that goes first.
const firstPlayerId = (numPlayers) => R.head(turnOrder(ids(numPlayers)))

// wallsPerPlayer :: Number -> Number
// Returns the number of walls each player starts with.
export const wallsPerPlayer = (numPlayers) => numPlayers == 2 ? 10 : 5

// setupPlayers :: Number -> Board -> Board
// Places all the players on the board in their staring positions.
const setupPlayers = (numPlayers, board) =>
  R.reduce(
    (board, playerId) =>
      putPlayer(playerId, startingLocations[playerId], board),
    board,
    ids(numPlayers))

// setupInventory :: Number -> Inventory
// Inventory :: {PlayerId: Number}
// Gives each player a preset number of walls.
const setupInventory = (numPlayers) =>
  R.zipObj(ids(numPlayers), R.repeat(wallsPerPlayer(numPlayers), numPlayers))

// isPointInbounds :: Point -> Boolean
// Checks whether the point is inside the bounds of the game.
export const isPointInbounds = (point) =>
  (point.row >= 0 && point.row < rows && point.col >= 0 && point.col < cols)

// playerIds :: Game -> [PlayerId]
// Returns all the player ids.
export const playerIds = (game) => R.map(parseInt, R.keys(game.board.players))

// playerWinLocations :: PlayerId -> [Point]
// Returns the player's win locations.
export const playerWinLocations = (playerId) => winLocations[playerId]

// playerLocation :: Game -> PlayerId -> Point
// Returns the player's location.
export const playerLocation = R.curry((game, playerId) =>
  R.view(R.lensPath(['board', 'players', playerId, 'location']), game))

// getPlayerIdOn :: Game -> Point -> PlayerId
// Gets the player id that is on the provided point. Returns undefined if no
// player is on the point.
export const getPlayerIdOn = R.curry((game, point) =>
  R.pipe(
    playerLocations,
    R.pickBy(R.equals(point)),
    R.keys,
    R.map(parseInt),
    R.head)
  (game))

// hasPlayer :: Game -> Point -> Boolean
// Checks whether the space is occupied by a player.
export const hasPlayer = R.curry((game, point) =>
  R.pipe(
    playerLocations,
    R.pickBy(R.equals(point)),
    R.complement(R.isEmpty))
  (game))

// playerLocations :: Game -> {PlayerId: Point}
// Returns an object with each player's location.
const playerLocations = (game) =>
  R.zipObj(playerIds(game), R.map(playerLocation(game), playerIds(game)))

// hasWall :: Game -> Wall -> Boolean
// Checks whether the wall exists in the game.
export const hasWall = R.curry((game, wall) =>
  R.includes(wall, game.board.walls))

// unblocked :: Game -> (Point -> [Point]) -> Point -> Boolean
// Checks if the edge relative to the provided point is unblocked.
export const unblocked = R.curry((game, pointToEdge, point) =>
  R.not(edgeOccupied(game, pointToEdge(point))))

// edgeOccupied :: Game -> [Point] -> Boolean
// Checks if the edge is occupied by a wall
export const edgeOccupied = R.curry((game, edge) =>
  gameWallEdges(game).has(edgeKey(edge)))

// gameWallEdges :: Game -> Set String
// Returns a list of wall edges in the game.
const gameWallEdges = R.memoizeWith(
  (game) => R.map(wallKey, game.board.walls),
  (game) =>
    new Set(R.pipe(R.chain(edges), R.map(edgeKey))(game.board.walls)))

// wallsAvailable :: Game -> Boolean
// Checks if the active player has walls available.
export const wallsAvailable = (game) =>
  R.gt(numWallsAvailable(game, game.activePlayerId), 0)

// numWallsAvailable :: Game -> PlayerId -> Number
// Returns the number of walls the player has available.
export const numWallsAvailable = R.curry((game, playerId) =>
  R.view(R.lensPath(['inventory', playerId]), game))

// consumeWall :: Game -> Game
// Removes a wall from the active player's inventory.
export const consumeWall = (game) =>
  R.over(R.lensPath(['inventory', game.activePlayerId]), R.dec, game)

// nextPlayersTurn :: Game -> Game
// Updates the game to be the next player's turn.
export const nextPlayersTurn = (game) =>
  R.over(
    R.lensProp('activePlayerId'),
    (playerId) =>
      R.pipe(
        playerIds,
        turnOrder,
        cycle(2),
        R.dropWhile(R.complement(R.equals(playerId))),
        R.nth(1))
      (game),
    game)

// updateBoard :: (Board -> Board) -> Game -> Game
// Updates the board in the game.
export const updateBoard = R.over(R.lensProp('board'))
