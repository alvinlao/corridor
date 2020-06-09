import * as R from 'ramda'

import { game } from '../core/game'

import { loadHistory } from './url'
import { decodeChar, decodeAction, decodeInit } from './action'

// historyToGames :: NotationHistory -> [Game]
// Decodes the history into a list of Games.
export const historyToGames = (history) => {
  if (!history) {
    return []
  }

  const _historyToGames = (history, games) => {
    if (!history) {
      return games
    }

    const prevGame = R.last(games)
    const action = decodeAction(R.head(history))
    return _historyToGames(R.tail(history), R.append(action(prevGame), games))
  }

  // The first byte always contains the initialization data.
  const initialGame = game(decodeInit(R.head(history)))
  return _historyToGames(R.tail(history), [initialGame])
}


// historyToNotations :: NotationHistory -> [Notation]
// Decodes the history into a list of notations.
export const historyToNotations = (history) => {
  const _historyToNotations = (history, notations) => {
    if (!history) {
      return notations
    }

    return _historyToNotations(
      R.tail(history), R.append({ notation: R.head(history) }, notations))
  }

  return _historyToNotations(history, [])
}
