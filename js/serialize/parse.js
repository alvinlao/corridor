import * as R from 'ramda'

import { game } from '../core/game'

import { loadHistory } from './url'
import { decodeChar, notationLength, decodeAction } from './action'

// historyToGames :: NotationHistory -> [Game]
// Builds a list of game states that reflects the notation history.
export const historyToGames = (history) => {
  const _historyToGames = (history, games) => {
    if (!history) {
      return games
    }

    const prevGame = R.last(games)
    const length = notationLength(decodeChar(R.head(history)))
    const decoder = decodeAction(R.take(length, history))
    return _historyToGames(
      R.drop(length, history),
      R.append(decoder(prevGame), games))
  }

  return _historyToGames(history, [])
}


// historyToNotations :: NotationHistory -> [Notation]
// Builds a list of notations that reflects the notation history.
export const historyToNotations = (history) => {
  const _historyToNotations = (history, notations) => {
    if (!history) {
      return notations
    }

    const length = notationLength(decodeChar(R.head(history)))
    return _historyToNotations(
      R.drop(length, history),
      R.append({ notation: R.take(length, history) }, notations))
  }

  return _historyToNotations(history, [])
}
