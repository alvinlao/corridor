import * as R from 'ramda'

import { game } from '../core/game'

import { loadHistory } from './url'
import { decodeChar, decodeAction, decodeInit } from './action'

// historyToGames :: NotationHistory -> [Game]
// Builds a list of game states that reflects the notation history.
export const historyToGames = (history) => {
  const _historyToGames = (history, games) => {
    if (!history) {
      return games
    }

    const prevGame = R.last(games)
    const decoder = decodeAction(R.take(1, history))
    return _historyToGames(
      R.drop(1, history),
      R.append(decoder(prevGame), games))
  }

  if (!history) {
    return []
  }
  const initialGame = game(decodeInit(R.head(history)))
  return _historyToGames(R.tail(history), [initialGame])
}


// historyToNotations :: NotationHistory -> [Notation]
// Builds a list of notations that reflects the notation history.
export const historyToNotations = (history) => {
  const _historyToNotations = (history, notations) => {
    if (!history) {
      return notations
    }

    return _historyToNotations(
      R.drop(1, history),
      R.append({ notation: R.take(1, history) }, notations))
  }

  return _historyToNotations(history, [])
}
