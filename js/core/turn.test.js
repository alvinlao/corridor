import * as R from 'ramda'
import { game, playerLocation } from './game'
import { point, north, south } from './point'
import { useWall, useMove, nextPlayersTurn } from './turn'
import { vwall } from './wall'


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
