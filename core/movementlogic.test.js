import * as R from 'ramda'
import { putPlayer, putWall } from './board'
import { game, updateBoard } from './game'
import { moves } from './movementlogic'
import { point, north, south, east, west } from './point'
import { hwall, vwall, wallEdges } from './wall'


test('moves no obstacles', () => {
  const playerId = 0
  const location = point(4, 4)
  const testGame =
    updateBoard(
      putPlayer(playerId, location),
      game(4))

  const actual = moves(testGame, playerId)

  expect(actual).toEqual([
    north(location),
    south(location),
    east(location),
    west(location),
  ])
})

test('moves jumps', () => {
  const playerId = 0
  const location = point(4, 4)
  const testGame =
    updateBoard(
      R.pipe(
        putPlayer(playerId, location),
        putPlayer(1, north(location)),
        putPlayer(2, south(location)),
        putPlayer(3, east(location)),
        putPlayer(4, west(location))),
      game(4))

  const actual = moves(testGame, playerId)

  expect(actual).toContainEqual(north(north((location))))
  expect(actual).toContainEqual(south(south((location))))
  expect(actual).toContainEqual(east(east((location))))
  expect(actual).toContainEqual(west(west((location))))
})

test('moves diagonal only', () => {
  const playerId = 0
  const location = point(4, 4)
  const testGame =
    updateBoard(
      R.pipe(
        putPlayer(playerId, location),
        putPlayer(1, north(location)),
        putPlayer(2, south(location)),
        putPlayer(3, east(location)),
        putPlayer(4, west(location)),
        putWall(hwall(north(location))),
        putWall(hwall(south(south(location)))),
        putWall(vwall(west(location))),
        putWall(vwall(east(east(location))))),
      game(4))

  const actual = moves(testGame, playerId)

  expect(actual).toContainEqual(north(west(location)))
  expect(actual).toContainEqual(north(east(location)))
  expect(actual).toContainEqual(south(west(location)))
  expect(actual).toContainEqual(south(east(location)))
})

// ========
//  ------ (top edge)
//  o 2 o
//  o 1 o
//  x o x
//  x x x
// ========
test('moves diagonals enabled at the edge', () => {
  const playerId = 0
  const location = point(7, 4)
  const testGame =
    updateBoard(
      R.pipe(
        putPlayer(playerId, location),
        putPlayer(2, north(location))),
      game(4))

  const actual = moves(testGame, playerId)

  expect(actual).toContainEqual(north(west(location)))
  expect(actual).toContainEqual(north(east(location)))
  expect(actual).toContainEqual(west(location))
  expect(actual).toContainEqual(east(location))
  expect(actual).toContainEqual(south(location))
})
