import * as R from 'ramda'
import { iterate, middle } from './util'

test('iterate 0', () => {
  const actual = iterate(0, R.inc, 0)

  expect(actual).toEqual([0])
})

test('iterate multiple times', () => {
  const actual = iterate(3, R.inc, 0)

  expect(actual).toEqual([0, 1, 2])
})

test('middle empty', () => {
  const actual = middle([])

  expect(actual).toEqual([])
})

test('middle non-empty', () => {
  const actual = middle([1, 2, 3, 4, 5])

  expect(actual).toEqual([2, 3, 4])
})
