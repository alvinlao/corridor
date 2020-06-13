import * as R from 'ramda'

import { undoableState } from './undoable'
import { loadHistory, loadMove } from '../history/url'
import { historyToGames, historyToNotations } from '../history/parse'

// hydrate :: () -> Store
// Creates an initial store state.
export const hydrate = () => {
  const history = loadHistory()
  const move = loadMove()
  if (!history) {
    return {}
  }

  return {
    game: undoableState(historyToGames(history), move),
    notation: undoableState(historyToNotations(history), move),
  }
}
