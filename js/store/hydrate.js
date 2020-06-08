import * as R from 'ramda'

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
    game: hydrateUndoable(historyToGames(history)),
    notation: hydrateUndoable(historyToNotations(history)),
  }
}

const hydrateUndoable = (states) => ({
  past: [],
  present: R.head(states),
  future: R.tail(states),
})
