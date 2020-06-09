import * as R from 'ramda'
import {
  game,
  isPointInbounds,
  playerIds,
  nextPlayersTurn,
  wallsAvailable,
  consumeWall,
  getPlayerIdOn,
  hasPlayer,
} from './game'
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

test('isPointInbounds yes', () => {
  const p = point(1, 1)

  const actual = isPointInbounds(p)

  expect(actual).toEqual(true)
})

test('isPointInbounds row bottom out of bounds', () => {
  const p = point(-1, 1)

  const actual = isPointInbounds(p)

  expect(actual).toEqual(false)
})

test('isPointInbounds row top out of bounds', () => {
  const p = point(10, 1)

  const actual = isPointInbounds(p)

  expect(actual).toEqual(false)
})

test('isPointInbounds col left out of bounds', () => {
  const p = point(1, -1)

  const actual = isPointInbounds(p)

  expect(actual).toEqual(false)
})

test('isPointInbounds col right out of bounds', () => {
  const p = point(1, 10)

  const actual = isPointInbounds(p)

  expect(actual).toEqual(false)
})

test('playerIds 2 player game', () => {
  const testGame = game(2)

  const actual = playerIds(testGame)

  expect(actual).toEqual([0, 1])
})

test('playerIds 4 player game', () => {
  const testGame = game(4)

  const actual = playerIds(testGame)

  expect(actual).toEqual([0, 1, 2, 3])
})

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

test('getPlayerIdOn player on point', () => {
  const testGame = game(4)
  const location = point(0, 4)

  const actual = getPlayerIdOn(testGame, location)

  expect(actual).toEqual(0)
})

test('getPlayerIdOn no player on point', () => {
  const testGame = game(4)
  const location = point(4, 4)

  const actual = getPlayerIdOn(testGame, location)

  expect(actual).toBeUndefined()
})

test('hasPlayer yes', () => {
  const testGame = game(4)
  const location = point(0, 4)

  const actual = hasPlayer(testGame, location)

  expect(actual).toEqual(true)
})

test('hasPlayer no', () => {
  const testGame = game(4)
  const location = point(0, 0)

  const actual = hasPlayer(testGame, location)

  expect(actual).toEqual(false)
})
