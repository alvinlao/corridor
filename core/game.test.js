import * as R from 'ramda'
import { game, nextPlayersTurn, wallsAvailable, consumeWall } from './game'
import { player } from './player'
import { point } from './point'


test('game 2 player', () => {
  const actualGame = game(2)

  expect(actualGame.board.players).toEqual({
    0: player(point(0, 4)),
    1: player(point(8, 4)),
  })
  expect(actualGame.board.walls).toEqual([])
  expect(actualGame.inventory).toEqual({
    0: 10,
    1: 10,
  })
  expect(actualGame.activePlayerId).toEqual(0)
});

test('game 4 player', () => {
  const actualGame = game(4)

  expect(actualGame.board.players).toEqual({
    0: player(point(0, 4)),
    1: player(point(8, 4)),
    2: player(point(4, 0)),
    3: player(point(4, 8)),
  })
  expect(actualGame.board.walls).toEqual([])
  expect(actualGame.inventory).toEqual({
    0: 5,
    1: 5,
    2: 5,
    3: 5,
  })
  expect(actualGame.activePlayerId).toEqual(0)
});

test('nextPlayersTurn next player', () => {
  const actualGame = R.pipe(
    nextPlayersTurn,
  )(game(4))

  expect(actualGame.activePlayerId).toEqual(1)
});

test('nextPlayersTurn back to player 1', () => {
  const actualGame = R.pipe(
    nextPlayersTurn,
    nextPlayersTurn,
    nextPlayersTurn,
    nextPlayersTurn,
  )(game(4))

  expect(actualGame.activePlayerId).toEqual(0)
});

test('wallsAvailable yes', () => {
  const testgame = game(4)

  const actual = wallsAvailable(testgame)

  expect(actual).toEqual(true)
});

test('wallsAvailable no', () => {
  const testgame = R.pipe(
    consumeWall,
    consumeWall,
    consumeWall,
    consumeWall,
    consumeWall,
  )(game(4))

  const actual = wallsAvailable(testgame)

  expect(actual).toEqual(false)
});

test('consumeWall 1 wall consumed', () => {
  const testgame = R.pipe(
    consumeWall,
  )(game(4))

  const actual = testgame.inventory[0]

  expect(actual).toEqual(4)
});
