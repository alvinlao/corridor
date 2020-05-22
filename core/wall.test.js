import * as R from 'ramda'
import { point } from './point'
import { hwall, vwall, wallPoints, isVertical, isHorizontal } from './wall'


test('isVertical vertical wall', () => {
  const wall = vwall(point(1, 1))

  const actual = isVertical(wall)

  expect(actual).toBe(true)
});

test('isVertical horizontal wall', () => {
  const wall = hwall(point(1, 1))

  const actual = isVertical(wall)

  expect(actual).toBe(false)
});

test('isHorizontal vertical wall', () => {
  const wall = vwall(point(1, 1))

  const actual = isHorizontal(wall)

  expect(actual).toBe(false)
});

test('isHorizontal horizontal wall', () => {
  const wall = hwall(point(1, 1))

  const actual = isHorizontal(wall)

  expect(actual).toBe(true)
});

test('wallPoints horizontal wall', () => {
  const wall = hwall(point(1, 1))

  const actualPoints = wallPoints(wall)

  expect(actualPoints).toEqual([
    point(1, 1),
    point(1, 2),
  ])
});

test('wallPoints vertical wall', () => {
  const wall = vwall(point(1, 1))

  const actualPoints = wallPoints(wall)

  expect(actualPoints).toEqual([
    point(1, 1),
    point(0, 1),
  ])
});
