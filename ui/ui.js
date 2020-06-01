import * as R from 'ramda'
import * as Konva from 'konva'
import { row, col } from '../core/game'
import { point } from '../core/point'
import { cell } from './cell'
import { initBoard } from './board'
import { initOverlay } from './overlay'
import { initOptions } from './options'

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

// gameStates :: Context -> [Element] -> [Game] -> {k: () => Game}
// Creates dictionary of functions for updating the singleton game states.
const gameStates = (context, elements, singletonGameStates) => ({
  latest: () => R.last(singletonGameStates),
  size: () => R.length(singletonGameStates),
  push: (game) => {
    pushGame(singletonGameStates, game)
    update(context, elements, singletonGameStates)
  },
  pop: () => {
    popGame(singletonGameStates)
    update(context, elements, singletonGameStates)
  },
  reset: (game) => {
    resetGame(singletonGameStates, game)
    update(context, elements, singletonGameStates)
  },
})

// init :: Context -> Game -> [{k: (* -> *)}]
// Initializes the ui and returns a list of the ui elements.
const init = R.curry((context, game) => {
  const singletonGameStates = []
  const elements = R.unnest([
    initBoard(context, game),
    initOverlay(context, 2),
    initOverlay(context, 4),
    initOptions(context),
  ])
  const _gameStates = gameStates(context, elements, singletonGameStates)
  
  setUpBind(context, elements, _gameStates)
  _gameStates.push(game)
  return elements
})

// setUpBind :: Context -> [Element] -> GameState -> ()
// Calls each element's bind function.
const setUpBind = (context, elements, gameStates) =>
  R.forEach(
    (bind) => bind(gameStates),
    R.map(R.prop('bind'), elements))

// update :: Context -> [Element] -> [Game] -> ()
// Calls each element's update function.
const update = R.curry((context, elements, singletonGameStates) => {
  const _gameStates = gameStates(context, elements, singletonGameStates)
  // Update all elements.
  R.forEach(
    (f) => f(_gameStates),
    R.map(R.prop('update'), elements))

  context.stage.draw()
})

// pushGame :: [Game] -> Game -> ()
// Pushes the provided game state onto the stack.
const pushGame = R.curry((singletonGameStates, game) => {
  // Update the game states singleton.
  singletonGameStates.push(game)
})

// popGame :: [Game] -> ()
// Drops the latest Game from the stack.
const popGame = (singletonGameStates) => {
  if (singletonGameStates.length <= 1) {
    return R.last(singletonGameStates)
  }

  // Update the game states singleton.
  singletonGameStates.pop()
}

// resetGame :: [Game] -> Game -> ()
// Clears the stack, then adds the provided Game.
const resetGame = (singletonGameStates, game) => {
  singletonGameStates.splice(0, singletonGameStates.length)
  singletonGameStates.push(game)
}
