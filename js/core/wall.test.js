import * as R from 'ramda'
import { point } from './point'
import { hwall, vwall, edges, isVertical } from './wall'


test('vwall created', () => {
  const actualWall = vwall(point(3, 0))

  expect(actualWall).toEqual({
    points: [point(3, 0), point(2, 0), point(1, 0)],
  })
})

test('hwall created', () => {
  const actualWall = hwall(point(3, 0))

  expect(actualWall).toEqual({
    points: [point(3, 0), point(3, 1), point(3, 2)],
  })
})

test('edges returned', () => {
  const wall = hwall(point(3, 0))

  const actualEdges = edges(wall)

  expect(actualEdges).toEqual([
    [point(3, 0), point(3, 1)],
    [point(3, 1), point(3, 2)],
  ])
})

test('isVertical true', () => {
  const wall = vwall(point(3, 0))

  const actual = isVertical(wall)

  expect(actual).toEqual(true)
})

test('isVertical false', () => {
  const wall = hwall(point(3, 0))

  const actual = isVertical(wall)

  expect(actual).toEqual(false)
})
