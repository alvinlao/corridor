import { combineReducers } from 'redux'
import { MOVE, WALL } from './actions'
import { undoable } from './undoable'

// game :: State Game -> Action -> State Game
const game = (state, action) => {
  switch (action.type) {
    case MOVE:
    case WALL:
      return action.game
    default:
      return state
  }
}

export const app = combineReducers({
  game: undoable(game),
})
