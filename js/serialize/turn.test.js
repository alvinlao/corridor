import * as R from 'ramda'

import { point, north, south, east, west } from '../core/point'
import { vwall, hwall } from '../core/wall'
import { game, playerLocation } from '../core/game'
import { useMove, useWall } from '../core/turn'

import {
  encodeReset,
  encodeUseMove,
  encodeUseWall,
  decodeUseWall,
  encodePoint,
  decodePoint,
  decodeTurn,
  moveDirection,
} from './turn'


test.each(
  [0, 1, 2, 3]
)('encodeReset encoded as ASCII', (numPlayers) => {
  const actual = encodeReset(numPlayers)

  expect(actual.length).toEqual(1)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseWall vertical encoded as ASCII', (testPoint) => {
  const actual = encodeUseWall(vwall(testPoint))

  expect(actual.length).toEqual(2)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
  expect(actual.charCodeAt(1) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseWall horizontal encoded as ASCII', (testPoint) => {
  const actual = encodeUseWall(hwall(testPoint))

  expect(actual.length).toEqual(2)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
  expect(actual.charCodeAt(1) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodePoint', (testPoint) => {
  const actualPoint = decodePoint(encodePoint(testPoint))

  expect(actualPoint).toEqual(testPoint)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodeUseWall vertical', (testPoint) => {
  const testWall = vwall(testPoint)

  const actualWall = decodeUseWall(encodeUseWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodeUseWall horizontal', (testPoint) => {
  const testWall = hwall(testPoint)

  const actualWall = decodeUseWall(encodeUseWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test('decodeTurn useReset', () => {
  const testGame = game(2)
  const notation = encodeReset(testGame.numPlayers)

  const actualGame = decodeTurn(notation)(null)

  expect(actualGame).toEqual(testGame)
})

test('decodeTurn useMove', () => {
  const testGame = game(2)
  const destination = south(playerLocation(testGame, testGame.activePlayerId))
  const notation = encodeUseMove(testGame, destination)

  const actualGame = decodeTurn(notation)(testGame)

  expect(actualGame).toEqual(useMove(testGame, destination))
})

test('decodeTurn vertical useWall', () => {
  const testGame = game(2)
  const wall = vwall(point(8, 8))
  const notation = encodeUseWall(wall)

  const actualGame = decodeTurn(notation)(testGame)

  expect(actualGame).toEqual(useWall(testGame, wall))
})

test('decodeTurn horizontal useWall', () => {
  const testGame = game(2)
  const wall = hwall(point(8, 8))
  const notation = encodeUseWall(wall)

  const actualGame = decodeTurn(notation)(testGame)

  expect(actualGame).toEqual(useWall(testGame, wall))
})

test('moveDirection north', () => {
  const testGame = game(2)
  const destination = north(playerLocation(testGame, testGame.activePlayerId))

  const actual = moveDirection(testGame, destination)

  expect(actual).toEqual(0)
})

test('moveDirection east', () => {
  const testGame = game(2)
  const destination = east(playerLocation(testGame, testGame.activePlayerId))

  const actual = moveDirection(testGame, destination)

  expect(actual).toEqual(2)
})
