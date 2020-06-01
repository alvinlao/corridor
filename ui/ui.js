import * as R from 'ramda'
import * as Konva from 'konva'
import { row, col } from '../core/game'
import { point } from '../core/point'
import { cell } from './cell'
import { initBoard } from './board'
import { initOverlay } from './overlay'
import { initOptions } from './options'
import {
  initGameStates,
  resetGameStates,
  pushGameState,
  undoGameState,
  redoGameState,
  currentGameState,
  olderGameStates,
  newerGameStates,
} from './gamestates'

// render :: Game -> ()
export const render = (game) => {
  var stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
  });

  // const size = R.max(R.min(window.innerWidth, window.innerHeight), 500)
  const size = 500
  const margin = 0
  const context = {
    stage,
    size: 500,
    margin: 0,
    topMargin: 150,
    // The size of the board in pixels.
    boardSize: size - (2 * margin),
  }

  init(context, game)
}


// init :: Context -> Game -> [{k: (* -> *)}]
// Initializes the ui and returns a list of the ui elements.
const init = R.curry((context, game) => {
  const elements = R.unnest([
    initBoard(context, game),
    initOverlay(context, 2),
    initOverlay(context, 4),
    initOptions(context),
  ])
  
  // Create a GameStatesHelper.
  const singleton = initGameStates()
  const gameStatesHelper = setUpGameStatesHelper(context, elements, singleton)

  // Bind every ui element.
  setUpBind(context, elements, gameStatesHelper)

  // Trigger an update call on every ui element with
  // the first Game.
  gameStatesHelper.push(game)

  return elements
})

// update :: Context -> [Element] -> GameStates -> ()
// Calls each element's update function.
const update = R.curry((context, elements, gameStatesSingleton) => {
  const gameStatesHelper =
    setUpGameStatesHelper(context, elements, gameStatesSingleton)
  R.forEach(
    (f) => f(gameStatesHelper),
    R.map(R.prop('update'), elements))
  context.stage.draw()
})

// setUpBind :: Context -> [Element] -> GameStatesHelper -> ()
// Calls each element's bind function.
const setUpBind = (context, elements, gameStatesHelper) => {
  R.forEach(
    (bind) => bind(gameStatesHelper),
    R.map(R.prop('bind'), elements))
}

// setUpGameStatesHelper :: Context -> [Element] -> GameStates -> GameStatesHelper
// Creates a dictionary with methods that view and mutate a single GameStates.
const setUpGameStatesHelper = R.curry((context, elements, singleton) => {
  return {
    reset: (game) => {
      resetGameStates(singleton, game)
      update(context, elements, singleton)
    },
    push: (game) => {
      pushGameState(singleton, game)
      update(context, elements, singleton)
    },
    undo: () => {
      undoGameState(singleton)
      update(context, elements, singleton)
    },
    redo: () => {
      redoGameState(singleton)
      update(context, elements, singleton)
    },
    current: () => currentGameState(singleton),
    older: () => olderGameStates(singleton),
    newer: () => newerGameStates(singleton),
  }
})
