import * as R from 'ramda'
import { board, putWall, putPlayer } from './board'
import { player } from './player'
import { point } from './point'
import { hwall } from './wall'


test('board created', () => {
  const actualBoard = board()

  expect(actualBoard).toEqual({
    walls: [],
    players: {},
  })
});

test('wall placed', () => {
  const initialBoard = board()
  const wall = hwall(point(0, 0))

  const actualBoard = putWall(wall, initialBoard)

  expect(actualBoard.walls).toEqual([wall])
});

test('duplicate wall placed', () => {
  const initialBoard = board()
  const wall = hwall(point(0, 0))

  const actualBoard =
    R.pipe(
      putWall(wall),
      putWall(wall))
    (initialBoard)

  expect(actualBoard.walls).toEqual([wall, wall])
});

test('player placed', () => {
  const initialBoard = board()
  const playerId = 0
  const location = point(0, 0)

  const actualBoard = putPlayer(playerId, location, initialBoard)

  expect(actualBoard.players).toEqual(R.objOf(playerId, player(location)))
});

test('existing player replaced', () => {
  const initialBoard = board()
  const playerId = 0

  const actualBoard =
    R.pipe(
      putPlayer(playerId, point(1, 1)),
      putPlayer(playerId, point(2, 2)),
      putPlayer(playerId, point(3, 3)))
    (initialBoard)

  expect(actualBoard.players).toEqual(R.objOf(playerId, player(point(3, 3))))
});
