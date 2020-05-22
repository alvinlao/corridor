import * as R from 'ramda'
import { board } from './board'
import { isWallInbounds } from './constraints'
import { point } from './point'
import { hwall, vwall } from './wall'

const testBoard = board({ rows: 9, cols: 9 })


test('isWallInbounds hangs left edge', () => {
  const wall = hwall(point(1, -1))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on left edge', () => {
  const wall = hwall(point(1, 0))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(true)
})

test('isWallInbounds hangs right edge', () => {
  const wall = hwall(point(1, 8))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on right edge', () => {
  const wall = hwall(point(1, 7))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(true)
})

test('isWallInbounds hangs top edge', () => {
  const wall = vwall(point(9, 1))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on top edge', () => {
  const wall = vwall(point(8, 1))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(true)
})

test('isWallInbounds hangs bottom edge', () => {
  const wall = vwall(point(0, 1))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(false)
})

test('isWallInbounds on bottom edge', () => {
  const wall = vwall(point(1, 1))

  const actual = isWallInbounds(testBoard, wall)

  expect(actual).toBe(true)
})
