import * as R from 'ramda'
import * as Konva from 'konva'
import { row, col } from '../core/game'
import { point } from '../core/point'
import { cell } from './cell'
import { initBoard } from './board'
import { initOverlay } from './overlay'

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
    // The size of the board in pixels.
    boardSize: size - (2 * margin),
  }

  init(context, game)
}

// getGame :: GameState -> (() -> Game)
const getGame = (gameState) =>
  () => gameState.game 

// init :: Context -> Game -> [{k: (* -> *)}]
// Initializes the ui and returns a list of the ui elements.
const init = R.curry((context, game) => {
  const gameState = { game }
  const elements = R.unnest([
    initBoard(context, game),
    initOverlay(context, game),
  ])
  
  setUpBind(context, elements, gameState)
  updateGame(context, elements, gameState, game)
  return elements
})

// setUpBind :: Context -> [Element] -> GameState -> ()
// Calls each element's bind function.
const setUpBind = (context, elements, gameState) =>
  R.forEach(
    (bind) => bind(getGame(gameState), updateGame(context, elements, gameState)),
    R.map(R.prop('bind'), elements))

// updateGame :: Context -> [Element] -> GameState -> Game -> ()
// Calls each element's update function with the provided Game.
const updateGame = R.curry((context, elements, gameState, game) => {
  // Update the singleton game state.
  gameState.game = game

  // Update all elements.
  R.forEach(
    (f) => f(game),
    R.map(R.prop('update'), elements))

  context.stage.draw()

  return game
})
