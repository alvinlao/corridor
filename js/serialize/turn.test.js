import * as R from 'ramda'

import { point, south } from '../core/point'
import { vwall, hwall } from '../core/wall'
import { game, playerLocation } from '../core/game'
import { useMove, useWall } from '../core/turn'

import {
  encodeUseMove,
  encodeUseWall,
  encodePoint,
  decodePoint,
  encodeWall,
  decodeWall,
  decodeTurn,
} from './turn'


test.each(
  R.map(R.call(point), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseMove singleCharacter', (testPoint) => {
  const actual = encodeUseMove(testPoint)

  expect(actual.charCodeAt() <= 127)
});

test.each(
  R.map(R.call(point), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseWall vertical singleCharacter', (testPoint) => {
  const actual = encodeUseWall(vwall(testPoint))

  expect(actual.charCodeAt() <= 127)
});

test.each(
  R.map(R.call(point), R.xprod(R.range(0, 9), R.range(0, 9)))
)('encodeUseWall horizontal singleCharacter', (testPoint) => {
  const actual = encodeUseWall(hwall(testPoint))

  expect(actual.charCodeAt() <= 127)
});

test('lossless encodePoint', () => {
  const testPoint = point(3, 6)

  const actualPoint = decodePoint(encodePoint(testPoint))

  expect(actualPoint).toEqual(testPoint)
});

test('lossless encodeWall vertical', () => {
  const testWall = vwall(point(4, 4))

  const actualWall = decodeWall(encodeWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test('lossless encodeWall horizontal', () => {
  const testWall = hwall(point(4, 4))

  const actualWall = decodeWall(encodeWall(testWall))

  expect(actualWall).toEqual(testWall)
});

test('decodeTurn useMove', () => {
  const testGame = game(2)
  const destination = south(playerLocation(testGame, testGame.activePlayerId))
  const notation = encodeUseMove(destination)

  const actualGame = decodeTurn(notation)(testGame)

  expect(actualGame).toEqual(useMove(testGame, destination))
})

test('decodeTurn vertical useWall', () => {
  const testGame = game(2)
  const wall = vwall(point(4, 4))
  const notation = encodeUseWall(wall)

  const actualGame = decodeTurn(notation)(testGame)

  expect(actualGame).toEqual(useWall(testGame, wall))
})

test('decodeTurn horizontal useWall', () => {
  const testGame = game(2)
  const wall = hwall(point(4, 4))
  const notation = encodeUseWall(wall)

  const actualGame = decodeTurn(notation)(testGame)

  expect(actualGame).toEqual(useWall(testGame, wall))
})
