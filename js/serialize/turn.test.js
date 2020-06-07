import * as R from 'ramda'

import { point, south } from '../core/point'
import { vwall, hwall } from '../core/wall'
import { game, playerLocation } from '../core/game'
import { useMove, useWall } from '../core/turn'

import {
  encodeReset,
  encodeUseMove,
  encodeUseWall,
  encodePoint,
  decodePoint,
  encodeWall,
  decodeWall,
  decodeTurn,
} from './turn'


test.each(
  [0, 1, 2, 3]
)('encodeReset singleCharacter', (numPlayers) => {
  const actual = encodeReset(numPlayers)

  expect(actual.length).toEqual(1)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseMove singleCharacter', (testPoint) => {
  const actual = encodeUseMove(testPoint)

  expect(actual.length).toEqual(2)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
  expect(actual.charCodeAt(1) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseWall vertical singleCharacter', (testPoint) => {
  const actual = encodeUseWall(vwall(testPoint))

  expect(actual.length).toEqual(3)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
  expect(actual.charCodeAt(1) <= 127).toEqual(true)
  expect(actual.charCodeAt(2) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseWall horizontal singleCharacter', (testPoint) => {
  const actual = encodeUseWall(hwall(testPoint))

  expect(actual.length).toEqual(3)
  expect(actual.charCodeAt(0) <= 127).toEqual(true)
  expect(actual.charCodeAt(1) <= 127).toEqual(true)
  expect(actual.charCodeAt(2) <= 127).toEqual(true)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodePoint', (testPoint) => {
  const actualPoint = decodePoint(encodePoint(testPoint))

  expect(actualPoint).toEqual(testPoint)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodeWall vertical', (testPoint) => {
  const testWall = vwall(testPoint)

  const actualWall = decodeWall(encodeWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test.each(
  R.map(([r, c]) => point(r, c), R.xprod(R.range(0, 9), R.range(0, 9)))
)('lossless encodeWall horizontal', (testPoint) => {
  const testWall = hwall(testPoint)

  const actualWall = decodeWall(encodeWall(testWall))

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
  const notation = encodeUseMove(destination)

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
