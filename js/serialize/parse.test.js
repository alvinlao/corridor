import * as R from 'ramda'

import { point, south } from '../core/point'
import { vwall, hwall } from '../core/wall'
import { game, playerLocation } from '../core/game'
import { useMove, useWall } from '../core/turn'

import { historyToGames } from './parse'

test('historyToGames empty history', () => {
  const history = ''

  const actualGames = historyToGames(history)

  expect(actualGames).toEqual([])
})

test('historyToGames reset and move', () => {
  const history = atob('CAFD')
  const testGame = game(2)
  const destination = south(playerLocation(testGame, testGame.activePlayerId))

  const actualGames = historyToGames(history)

  expect(actualGames).toEqual([testGame, useMove(testGame, destination)])
})

test('historyToGames reset and wall', () => {
  const history = atob('CAIoAA==')
  const testGame = game(2)
  const wall = hwall(point(4, 4))

  const actualGames = historyToGames(history)

  expect(actualGames).toEqual([testGame, useWall(testGame, wall)])
})
