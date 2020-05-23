import * as R from 'ramda'
import { board, putWall } from './board'
import {
  isWallInbounds,
  isWallSpaceOccupied,
  isWallOverlapping
} from './constraints'
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
  const wall = hwall(point(1, 6))

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
  const wall = vwall(point(2, 1))

  const actual = isWallInbounds(testBoard, wall)

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

test('isWallOverlapping different orientation crossed', () => {
  const wall1 = vwall(point(3, 3))
  const wall2 = hwall(point(2, 2))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(true)
})

test('isWallOverlapping vertical parallel', () => {
  const wall1 = vwall(point(3, 3))
  const wall2 = vwall(point(3, 2))

  const actual = isWallOverlapping(wall1, wall2)

  expect(actual).toBe(false)
})

test('isWallOverlapping horizontal parallel', () => {
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
  const b = R.pipe(
      putWall(wall1),
      putWall(wall2))
    (testBoard)

  const actual = isWallSpaceOccupied(b, vwall(2, 1))

  expect(actual).toBe(false)
})

test('isWallSpaceOccupied || overlap', () => {
  const wall1 = vwall(point(2, 0))
  const wall2 = vwall(point(2, 2))
  const b = R.pipe(
      putWall(wall1),
      putWall(wall2))
    (testBoard)

  const actual = isWallSpaceOccupied(b, wall2)

  expect(actual).toBe(true)
})

test('isWallSpaceOccupied H valid', () => {
  const wall1 = vwall(point(2, 0))
  const wall2 = vwall(point(2, 2))
  const b = R.pipe(
      putWall(wall1),
      putWall(wall2))
    (testBoard)

  const actual = isWallSpaceOccupied(b, hwall(1, 0))

  expect(actual).toBe(false)
})
