import { RESET, UNDO, REDO } from './actions'


export const undoable = (reducer) => {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }

  return (state=initialState, action) => {
    const { past, present, future } = state

    switch(action.type) {
      case RESET:
        return {
          past: [],
          present: action.state,
          future: [],
        }
      case UNDO:
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        }
      case REDO:
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        }
      default:
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state
        }
        return {
          past: present === undefined ? [...past] : [...past, present],
          present: newPresent,
          future: [],
        }
    }
  }
}
