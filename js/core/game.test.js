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
  expect(actualGame.activePlayerId).toEqual(1)
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
  expect(actualGame.activePlayerId).toEqual(1)
});

test('nextPlayersTurn next player', () => {
  const testGame = game(4)

  const actualGame = R.pipe(
      nextPlayersTurn,
    )(testGame)

  expect(actualGame.activePlayerId).toEqual(3)
});

test('nextPlayersTurn back to player 1', () => {
  const testGame = game(4)
  const initialPlayerId = testGame.activePlayerId

  const actualGame = R.pipe(
      nextPlayersTurn,
      nextPlayersTurn,
      nextPlayersTurn,
      nextPlayersTurn,
    )(testGame)

  expect(actualGame.activePlayerId).toEqual(initialPlayerId)
});

test('wallsAvailable yes', () => {
  const testGame = game(4)

  const actual = wallsAvailable(testGame)

  expect(actual).toEqual(true)
});

test('wallsAvailable no', () => {
  const testGame = R.pipe(
    consumeWall,
    consumeWall,
    consumeWall,
    consumeWall,
    consumeWall,
  )(game(4))

  const actual = wallsAvailable(testGame)

  expect(actual).toEqual(false)
});

test('consumeWall 1 wall consumed', () => {
  let testGame = game(4)
  const playerId = testGame.activePlayerId
  testGame = consumeWall(testGame)

  const actual = testGame.inventory[playerId]

  expect(actual).toEqual(4)
});
