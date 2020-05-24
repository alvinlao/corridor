import * as R from 'ramda'
import { game } from './game'
import { player } from './player'
import { point } from './point'


test('game 2 player', () => {
  const actualGame = game(2)

  expect(actualGame.board.players).toEqual({
    0: player(point(0, 4)),
    1: player(point(8, 4)),
  })
  expect(actualGame.board.walls).toEqual([])
});

test('game 4 player', () => {
  const actualGame = game(4)

  expect(actualGame.board.players).toEqual({
    0: player(point(0, 4)),
    1: player(point(8, 4)),
    2: player(point(4, 0)),
    3: player(point(8, 0)),
  })
  expect(actualGame.board.walls).toEqual([])
});
