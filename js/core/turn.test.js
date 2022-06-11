import * as R from 'ramda'
import { putWall, putPlayer } from './board'
import { game, playerLocation, updateBoard } from './game'
import { point, north, south } from './point'
import { useWall, useMove, nextPlayersTurn } from './turn'
import { hwall, vwall } from './wall'


test('useWall yes', () => {
  const wall = vwall(point(4, 4))
  const testGame = game(4)
  const playerId = testGame.activePlayerId

  const actualGame = useWall(testGame, wall)

  expect(actualGame.activePlayerId).not.toEqual(playerId)
  expect(actualGame.inventory[playerId]).toEqual(4)
  expect(actualGame.board.walls).toContainEqual(wall)
})

test('useWall invalid wall', () => {
  const wall = vwall(point(0, 0))
  const testGame = game(4)
  const playerId = testGame.activePlayerId

  const actualGame = useWall(testGame, wall)

  expect(actualGame.activePlayerId).toEqual(testGame.activePlayerId)
  expect(actualGame.inventory[playerId]).toEqual(5)
  expect(actualGame.board.walls).toEqual([])
})

test('useWall no walls available', () => {
  const wall = vwall(point(4, 4))
  let testGame = game(4)
  const playerId = testGame.activePlayerId
  testGame = R.set(R.lensPath(['inventory', playerId]), 0, testGame)

  const actualGame = useWall(testGame, wall)

  expect(actualGame.activePlayerId).toEqual(playerId)
  expect(actualGame.inventory[playerId]).toEqual(0)
  expect(actualGame.board.walls).toEqual([])
})

test('useMove yes', () => {
  const testGame = game(4)
  const playerId = testGame.activePlayerId
  const location = playerLocation(testGame, playerId)

  const actualGame = useMove(testGame, south(location))

  expect(actualGame.activePlayerId).not.toEqual(playerId)
  expect(playerLocation(actualGame, playerId)).toEqual(south(location))
})

test('useMove invalid move', () => {
  const testGame = game(4)
  const playerId = testGame.activePlayerId
  const location = playerLocation(testGame, playerId)

  const actualGame = useMove(testGame, south(south(south(location))))

  expect(actualGame.activePlayerId).toEqual(playerId)
  expect(playerLocation(actualGame, playerId)).toEqual(location)
})

test('nextPlayersTurn next player', () => {
  const testGame = game(4)

  const actualGame = R.pipe(
      nextPlayersTurn,
    )(testGame)

  expect(actualGame.activePlayerId).toEqual(3)
});

test('nextPlayersTurn back to player 1', () => {
  const testGame = game(4)
  const initialPlayerId = testGame.activePlayerId

  const actualGame = R.pipe(
      nextPlayersTurn,
      nextPlayersTurn,
      nextPlayersTurn,
      nextPlayersTurn,
    )(testGame)

  expect(actualGame.activePlayerId).toEqual(initialPlayerId)
});


// The game is set up as:
// * Player 1 has no walls.
// * Player 3 has no walls.
// * Player 1 is at (7, 0).
// * Player 3 is at (7, 1).
// * Player 0 is at (7, 2).
// * Player 2 is at (7, 3).
// * Horizontal wall at (7, 0).
// * Horizontal wall at (7, 2).
// * Horizontal wall at (6, 0).
// * Horizontal wall at (6, 2).
//
// Diagram:
//    0 1 2 3
//    ======
// 8 |
//   |- - - -
// 7 |1 3 0 2
//   |- - - -
//
// The next player after Player 2 would normally be Player 1, but since Player 1
// and Player 3 have no valid moves, the next player is Player 0.
test('nextPlayersTurn skip player with no moves', () => {
  const testGame = game(4)

  const actualGame = R.pipe(
      // Set Player 1's walls to 0.
      R.over(R.lensPath(['inventory', '1']), () => 0),
      // Set Player 3's walls to 0.
      R.over(R.lensPath(['inventory', '3']), () => 0),
      updateBoard(putPlayer(1, point(7, 0))),
      updateBoard(putPlayer(3, point(7, 1))),
      updateBoard(putPlayer(0, point(7, 2))),
      updateBoard(putPlayer(2, point(7, 3))),
      updateBoard(putWall(hwall(point(7, 0)))),
      updateBoard(putWall(hwall(point(7, 2)))),
      updateBoard(putWall(hwall(point(6, 0)))),
      updateBoard(putWall(hwall(point(6, 2)))),
      R.over(R.lensProp('activePlayerId'), () => 2),
      nextPlayersTurn,
    )(testGame)

  expect(actualGame.activePlayerId).toEqual(0)
});
