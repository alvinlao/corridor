import * as R from 'ramda'
import { board, putWall, putPlayer } from './board'
import { game, updateBoard } from './game'
import {
  isWallInbounds,
  isWallSpaceOccupied,
  isWallOverlapping,
  isGameCompletable,
  isGameOver,
  isValidWall,
  canUp,
} from './logic'
import { point, north, south, east, west, ncoord } from './point'
import { hwall, vwall, wallEdges } from './wall'
import { middle } from '../util'

const testGame = game(2)


test('isWallInbounds hangs left edge', () => {
  const wall = hwall(point(1, -1))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on left edge', () => {
  const wall = hwall(point(1, 0))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(true)
})

test('isWallInbounds hangs right edge', () => {
  const wall = hwall(point(1, 8))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on right edge', () => {
  const wall = hwall(point(1, 6))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(true)
})

test('isWallInbounds hangs top edge', () => {
  const wall = vwall(point(9, 1))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on top edge', () => {
  const wall = vwall(point(8, 1))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(true)
})

test('isWallInbounds hangs bottom edge', () => {
  const wall = vwall(point(0, 1))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on bottom edge', () => {
  const wall = vwall(point(2, 1))

  const actual = isWallInbounds(testGame, wall)

  expect(actual).toBe(true)
})

test('isWallOverlapping same orientation with bottom half overlap', () => {
  const wall1 = vwall(point(2, 1))
  const wall2 = vwall(point(1, 1))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(true)
})

test('isWallOverlapping same orientation with top half overlap', () => {
  const wall1 = vwall(point(2, 1))
  const wall2 = vwall(point(3, 1))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(true)
})

test('isWallOverlapping +', () => {
  const wall1 = vwall(point(3, 3))
  const wall2 = hwall(point(2, 2))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(true)
})

test('isWallOverlapping ||', () => {
  const wall1 = vwall(point(3, 3))
  const wall2 = vwall(point(3, 2))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(false)
})

test('isWallOverlapping =', () => {
  const wall1 = hwall(point(3, 3))
  const wall2 = hwall(point(2, 3))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(false)
})

test('isWallOverlapping L', () => {
  const wall1 = vwall(point(3, 3))
  const wall2 = hwall(point(1, 3))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(false)
})

test('isWallOverlapping T', () => {
  const wall1 = hwall(point(3, 3))
  const wall2 = vwall(point(3, 4))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(false)
})

test('isWallSpaceOccupied |||', () => {
  const wall1 = vwall(point(2, 0))
  const wall2 = vwall(point(2, 2))
  const g = updateBoard(
    R.pipe(
      putWall(wall1),
      putWall(wall2)),
    testGame)

  const actual = isWallSpaceOccupied(g, vwall(point(2, 1)))

  expect(actual).toBe(false)
})

test('isWallSpaceOccupied || overlap', () => {
  const wall1 = vwall(point(2, 0))
  const wall2 = vwall(point(2, 2))
  const g = updateBoard(
    R.pipe(
      putWall(wall1),
      putWall(wall2)),
    testGame)

  const actual = isWallSpaceOccupied(g, wall2)

  expect(actual).toBe(true)
})

test('isWallSpaceOccupied H valid', () => {
  const wall1 = vwall(point(2, 0))
  const wall2 = vwall(point(2, 2))
  const g = updateBoard(
    R.pipe(
      putWall(wall1),
      putWall(wall2)),
    testGame)

  const actual = isWallSpaceOccupied(g, hwall(point(1, 0)))

  expect(actual).toBe(false)
})

test('isGameCompletable empty board', () => {
  const testGame = game(4)

  const actual = isGameCompletable(testGame)

  expect(actual).toBe(true)
})

test('isGameCompletable gap', () => {
  const testGame = updateBoard(
      R.pipe(
        putWall(hwall(point(7, 0))),
        // Gap between walls.
        putWall(hwall(point(7, 3))),
        putWall(hwall(point(7, 4))),
        putWall(hwall(point(7, 5))),
        putWall(hwall(point(7, 6))),
        putWall(hwall(point(7, 7))),
        putWall(hwall(point(7, 8)))),
      game(4))

  const actual = isGameCompletable(testGame)

  expect(actual).toBe(true)
})

test('isGameCompletable top row blocked', () => {
  const testGame = updateBoard(
      R.pipe(
        putWall(hwall(point(7, 0))),
        putWall(hwall(point(7, 1))),
        putWall(hwall(point(7, 2))),
        putWall(hwall(point(7, 3))),
        putWall(hwall(point(7, 4))),
        putWall(hwall(point(7, 5))),
        putWall(hwall(point(7, 6))),
        putWall(hwall(point(7, 7)))),
      game(4))

  const actual = isGameCompletable(testGame)

  expect(actual).toBe(false)
})

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
