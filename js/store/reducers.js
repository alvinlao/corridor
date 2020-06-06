import { combineReducers } from 'redux'
import { PUSH } from './actions'
import { undoable } from './undoable'

// game :: State -> Action -> State
const game = (state, action) => {
  switch (action.type) {
    case PUSH:
      return action.game
    default:
      return state
  }
}


export const app = combineReducers({
  game: undoable(game),
})
