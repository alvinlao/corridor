import * as R from 'ramda'
import { RESET, UNDO, REDO } from './timetravel'

import { decUntil, incUntil } from '../util/math'


// undoableState :: [State a] -> UndoableState a
export const undoableState = (states, index=0) => ({
  history: states,
  index: R.min(index, states.length - 1),
})

// index, history :: Lens UndoableState a
const index = R.lensProp('index')
const history = R.lensProp('history')

// undoable :: Reducer -> UndoableState a -> Action -> UndoableState a
export const undoable = (reducer) => (
  (state=undoableState([reducer(undefined, {})]), action) => {
    switch(action.type) {
      case RESET:
        return undoableState([reducer(undefined, action)])
      case UNDO:
        return R.over(index, decUntil(0), state)
      case REDO:
        return R.over(index, incUntil(state.history.length - 1), state)
      default:
        const newPresent = reducer(present(state), action)
        if (present(state) === newPresent) {
          return state
        }
        return R.pipe(
          R.set(history, rewrite(newPresent, state)),
          R.over(index, R.inc))
        (state)
    }
  })

// present :: UndoableState a -> State a | undefined
// Returns the latest state.
export const present = (state) => R.nth(state.index, state.history)

// past :: UndoableState a -> [State a]
// Returns the past states.
export const past = (state) => state.history.slice(0, state.index)

// future :: UndoableState a -> [State a]
// Returns the future states.
export const future = (state) => state.history.slice(state.index + 1)

// rewrite :: State a -> UndoableState a -> [State a]
// Creates a new history with the new present.
const rewrite = (newPresent, state) =>
  R.concat(past(state), [present(state), newPresent])
