import * as R from 'ramda'
import { putWall, putPlayer } from './board'
import { game, updateBoard } from './game'
import { isGameOver, isValidWall, winners } from './logic'
import { point } from './point'
import { hwall, vwall } from './wall'


test('isValidWall yes', () => {
  const testGame = game(4)
  const wall = hwall(point(1, 1))

  const actual = isValidWall(testGame, wall)

  expect(actual).toBe(true)
})

test('isValidWall overlap', () => {
  const testGame =
    updateBoard(putWall(hwall(point(1, 0))), game(4))
  const wall = hwall(point(1, 1))

  const actual = isValidWall(testGame, wall)

  expect(actual).toBe(false)
})

test('isValidWall cages player', () => {
  const testGame = updateBoard(
      R.pipe(
        putWall(vwall(point(1, 4))),
        putWall(vwall(point(1, 5)))),
      game(4))
  const wall = hwall(point(1, 4))

  const actual = isValidWall(testGame, wall)

  expect(actual).toBe(false)
})

test('isValidWall outside', () => {
  const testGame = game(4)
  const wall = hwall(point(-1, -1))

  const actual = isValidWall(testGame, wall)

  expect(actual).toBe(false)
})

test('isGameOver no', () => {
  const testGame = game(4)

  const actual = isGameOver(testGame)

  expect(actual).toBe(false)
})

test('isGameOver yes', () => {
  const playerId = 0
  const testGame =
    updateBoard(
      putPlayer(playerId, point(8, 0)),
      game(4))

  const actual = isGameOver(testGame)

  expect(actual).toBe(true)
})

test('winners empty', () => {
  const testGame = game(4)

  const actual = winners(testGame)

  expect(actual).toEqual([])
})

test('winners 2 player all winners', () => {
  const testGame =
    updateBoard(
      R.pipe(
        putPlayer(0, point(8, 0)),
        putPlayer(1, point(0, 0))),
      game(2))

  const actual = winners(testGame)

  expect(actual).toEqual([0, 1])
})

test('winners 4 player all winners', () => {
  const testGame =
    updateBoard(
      R.pipe(
        putPlayer(0, point(8, 0)),
        putPlayer(1, point(0, 0)),
        putPlayer(2, point(0, 8)),
        putPlayer(3, point(0, 0))),
      game(4))

  const actual = winners(testGame)

  expect(actual).toEqual([0, 1, 2, 3])
})
