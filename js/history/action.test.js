import * as R from 'ramda'

import { putPlayer } from '../core/board'
import { point, north, south, east, west } from '../core/point'
import { vwall, hwall } from '../core/wall'
import { game, playerLocation, updateBoard } from '../core/game'
import { useMove, useWall } from '../core/turn'

import {
  encodeInit,
  decodeInit,
  encodeUseMove,
  encodeUseWall,
  decodeUseWall,
  encodePoint,
  decodePoint,
  encodeWallPoint,
  decodeWallPoint,
  decodeAction,
} from './action'


test.each(
  [0, 1, 2, 3]
)('encodeInit encoded as bytes', (numPlayers) => {
  const actual = encodeInit(numPlayers)

  expect(actual.length).toEqual(1)
  expect(actual.charCodeAt(0)).toBeLessThan(256)
  expect(actual.charCodeAt(0)).toBeGreaterThanOrEqual(0)
});

test.each([
  north,
  south,
  east,
  west,
  R.compose(north, north),
  R.compose(south, south),
  R.compose(east, east),
  R.compose(west, west),
  R.compose(north, east),
  R.compose(north, west),
  R.compose(south, east),
  R.compose(south, west),
])('encodeUseMove encoded as bytes', (direction) => {
  const location = point(4, 4)
  const initGame = game(4)
  const testGame =
    updateBoard(putPlayer(initGame.activePlayerId, location), initGame)

  const actual = encodeUseMove(direction(location))

  expect(actual.length).toEqual(1)
  expect(actual.charCodeAt(0)).toBeLessThan(256)
  expect(actual.charCodeAt(0)).toBeGreaterThanOrEqual(0)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(1, 9), R.range(1, 9)))
)('encodeUseWall vertical encoded as bytes', (testPoint) => {
  const actual = encodeUseWall(vwall(testPoint))

  expect(actual.length).toEqual(1)
  expect(actual.charCodeAt(0)).toBeLessThan(256)
  expect(actual.charCodeAt(0)).toBeGreaterThanOrEqual(0)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 8), R.range(0, 8)))
)('encodeUseWall horizontal encoded as bytes', (testPoint) => {
  const actual = encodeUseWall(hwall(testPoint))

  expect(actual.length).toEqual(1)
  expect(actual.charCodeAt(0)).toBeLessThan(256)
  expect(actual.charCodeAt(0)).toBeGreaterThanOrEqual(0)
});

test.each([
  2, 4
])('lossless encodeInit', (numPlayers) => {
  const actual = decodeInit(encodeInit(numPlayers))

  expect(actual).toEqual(numPlayers)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodePoint', (testPoint) => {
  const actualPoint = decodePoint(encodePoint(testPoint))

  expect(actualPoint).toEqual(testPoint)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 8), R.range(0, 8)))
)('lossless encodeWallPoint', (testPoint) => {
  const actualPoint = decodeWallPoint(encodeWallPoint(testPoint))

  expect(actualPoint).toEqual(testPoint)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(1, 9), R.range(1, 9)))
)('lossless encodeUseWall vertical', (testPoint) => {
  const testWall = vwall(testPoint)

  const actualWall = decodeUseWall(encodeUseWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 8), R.range(0, 8)))
)('lossless encodeUseWall horizontal', (testPoint) => {
  const testWall = hwall(testPoint)

  const actualWall = decodeUseWall(encodeUseWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test('decodeAction useMove', () => {
  const testGame = game(2)
  const destination = south(playerLocation(testGame, testGame.activePlayerId))
  const notation = encodeUseMove(destination)

  const actualGame = decodeAction(notation)(testGame)

  expect(actualGame).toEqual(useMove(testGame, destination))
})

test('decodeAction vertical useWall', () => {
  const testGame = game(2)
  const wall = vwall(point(8, 8))
  const notation = encodeUseWall(wall)

  const actualGame = decodeAction(notation)(testGame)

  expect(actualGame).toEqual(useWall(testGame, wall))
})

test('decodeAction horizontal useWall', () => {
  const testGame = game(2)
  const wall = hwall(point(8, 8))
  const notation = encodeUseWall(wall)

  const actualGame = decodeAction(notation)(testGame)

  expect(actualGame).toEqual(useWall(testGame, wall))
})
