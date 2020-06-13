import * as R from 'ramda'

import { undoableState } from './undoable'
import { loadHistory } from '../history/url'
import { historyToGames, historyToNotations } from '../history/parse'

// hydrate :: () -> Store
// Creates an initial store state.
export const hydrate = () => {
  const history = loadHistory()
  if (!history) {
    return {}
  }

  return {
    game: undoableState(historyToGames(history)),
    notation: undoableState(historyToNotations(history)),
  }
}
