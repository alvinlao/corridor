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

  const actual = moves(playerId, testGame)

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

  const actual = moves(playerId, testGame)

  expect(actual).toEqual([
    north(north(location)),
    south(south(location)),
    east(east(location)),
    west(west(location)),
  ])
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

  const actual = moves(playerId, testGame)

  expect(actual).toContainEqual(north(west(location)))
  expect(actual).toContainEqual(north(east(location)))
  expect(actual).toContainEqual(south(west(location)))
  expect(actual).toContainEqual(south(east(location)))
})
