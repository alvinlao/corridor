import * as R from 'ramda'
import * as Konva from 'konva'

import { row, col } from '../core/game'
import { point } from '../core/point'

import { store, observeStore } from '../store/store'
import { push } from '../store/actions'

import { cell } from './cell'
import { initBoard } from './board'
import { initOverlay } from './overlay'
import { initOptions } from './options'

// render :: Game -> ()
export const render = (game) => {
  const stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
  });

  const context = {
    stage,
    size: 500,
    topMargin: 150,
  }

  init(context, game)
}

// init :: Context -> Game -> ()
// Initializes the ui.
const init = R.curry((context, game) => {
  const elements = R.unnest([
    initBoard(context, game),
    initOverlay(context, 2),
    initOverlay(context, 4),
    initOptions(context),
  ])

  // Trigger an update call on every ui element with the first Game.
  store.dispatch(push(game))

  // Set up store listener that triggers ui redraws.
  observeStore(store, R.lensPath([]), update(context, elements))
})

// update :: Context -> [Element] -> State -> ()
// Calls each element's update function.
const update = R.curry((context, elements, state) => {
  R.forEach(
    (f) => f(state),
    R.map(R.prop('update'), elements))
  context.stage.batchDraw()
})
