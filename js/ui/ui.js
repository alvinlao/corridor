import * as R from 'ramda'
import * as Konva from 'konva'

import { row, col } from '../core/game'
import { point } from '../core/point'

import { store, observeStore } from '../store/store'
import { reset } from '../store/actions'

import { replaceHistory } from '../history/url'

import { cell } from './cell'
import { stageWidth, stageHeight } from './constants'
import { initBoard } from './boardlayer'
import { initOverlay } from './overlaylayer'
import { initOptions } from './options'

// render :: Game -> ()
export const render = (game) => {
  const stage = initStage()
  initUi({ stage }, game)
}

// initStage :: () -> Stage
const initStage = () => (
  new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight,
  }))

// initUi :: Context -> Game -> ()
const initUi = R.curry((context, game) => {
  const elements = R.unnest([
    initBoard(context, game),
    initOverlay(context),
  ])

  if (R.isNil(store.getState().game.present)) {
    // Start a new game.
    store.dispatch(reset(game))
  }

  // Set up store listener that triggers ui redraws.
  observeStore(store, R.lensPath([]), onStoreChange(context, elements))
})

// onStoreChange :: Context -> [Element] -> State -> ()
// Updates the ui upon the store changing.
const onStoreChange = R.curry((context, elements, state) => {
  // Call each element's update function.
  R.forEach((f) => f(state), R.map(R.prop('update'), elements))

  // Re-draw.
  context.stage.batchDraw()

  // Update the url history parameter.
  replaceHistory(state)
})
