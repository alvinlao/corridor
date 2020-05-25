import * as R from 'ramda'
import { game, playerLocation } from './game'
import { point, north, south } from './point'
import { useWall, useMove } from './turn'
import { vwall } from './wall'


test('useWall yes', () => {
  const playerId = 0
  const wall = vwall(point(4, 4))

  const actualGame = useWall(game(4), wall)

  expect(actualGame.activePlayerId).toEqual(R.inc(playerId))
  expect(actualGame.inventory[0]).toEqual(4)
  expect(actualGame.board.walls).toContainEqual(wall)
})

test('useWall invalid wall', () => {
  const playerId = 0
  const wall = vwall(point(0, 0))

  const actualGame = useWall(game(4), wall)

  expect(actualGame.activePlayerId).toEqual(playerId)
  expect(actualGame.inventory[0]).toEqual(5)
  expect(actualGame.board.walls).toEqual([])
})

test('useWall no walls available', () => {
  const playerId = 0
  const wall = vwall(point(4, 4))
  const testGame = R.set(R.lensPath(['inventory', playerId]), 0, game(4))

  const actualGame = useWall(testGame, wall)

  expect(actualGame.activePlayerId).toEqual(playerId)
  expect(actualGame.inventory[0]).toEqual(0)
  expect(actualGame.board.walls).toEqual([])
})

test('useMove yes', () => {
  const playerId = 0
  const testGame = game(4)
  const location = playerLocation(testGame, playerId)

  const actualGame = useMove(testGame, north(location))

  expect(actualGame.activePlayerId).toEqual(R.inc(playerId))
  expect(playerLocation(actualGame, playerId)).toEqual(north(location))
})

test('useMove invalid move', () => {
  const playerId = 0
  const testGame = game(4)
  const location = playerLocation(testGame, playerId)

  const actualGame = useMove(testGame, south(location))

  expect(actualGame.activePlayerId).toEqual(playerId)
  expect(playerLocation(actualGame, playerId)).toEqual(location)
})
