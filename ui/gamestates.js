import * as R from 'ramda'
import * as Konva from 'konva'
import { row, col } from '../core/game'
import { point } from '../core/point'
import { cell } from './cell'
import { initBoard } from './board'
import { initOverlay } from './overlay'
import { initOptions } from './options'


// initGameStates :: () -> GameStates
// Creates a new GameStates.
export const initGameStates = () => ({
  history: [],
  index: -1,
})

// resetGameStates :: GameStates -> Game -> ()
// Resets the GameStates to a single Game.
export const resetGameStates = (gameStates, game) => {
  gameStates.history = [game]
  gameStates.index = 0
}

// pushGameState :: GameStates -> Game -> ()
// Adds the provided Game to the GameStates and
// destroys the history after the current game state.
export const pushGameState = (gameStates, game) => {
  if (gameStates.cur != -1) {
    gameStates.history.splice(gameStates.index + 1)
  }
  gameStates.history.push(game)
  gameStates.index += 1
}

// undoGameState :: GameStates -> ()
// Reverts to the previous game state, if possible.
export const undoGameState = (gameStates) => {
  if (gameStates.index > 0) {
    gameStates.index -= 1
  }
}

// redoGameState :: GameStates -> ()
// Moves to the next game state, if possible.
export const redoGameState = (gameStates) => {
  if (gameStates.index < gameStates.history.length - 1) {
    gameStates.index += 1
  }
}

// currentGameState :: GameStates -> Game
// Returns the current game state.
export const currentGameState = (gameStates) => {
  if (gameStates.index >= 0) {
    return gameStates.history[gameStates.index]
  }
  return null
}

// olderGameStates :: GameStates -> ()
// Returns the number of older game states than the current one.
export const olderGameStates = (gameStates) => {
  return gameStates.index
}

// newerGameStates :: GameStates -> ()
// Returns the number of newer game states than the current one.
export const newerGameStates = (gameStates) => {
  return gameStates.history.length - gameStates.index - 1
}
