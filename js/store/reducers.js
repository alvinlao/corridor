import { combineReducers } from 'redux'
import { MOVE, WALL } from './actions'
import { RESET } from './timetravel'
import { undoable } from './undoable'

// game :: State Game -> Action -> State Game
const game = (state, action) => {
  switch (action.type) {
    case RESET:
    case MOVE:
    case WALL:
      return action.game
    default:
      return state
  }
}

// notation :: State Notation -> Action -> State Notation
const notation = (state, action) => {
  switch (action.type) {
    case RESET:
    case MOVE:
    case WALL:
      return action.notation
    default:
      return state
  }
}

export const app = combineReducers({
  game: undoable(game),
  notation: undoable(notation),
})
