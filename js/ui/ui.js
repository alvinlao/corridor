import * as R from 'ramda'
import * as Konva from 'konva'

import { row, col } from '../core/game'
import { point } from '../core/point'

import { store, observeStore } from '../store/store'
import { init } from '../store/actions'

import { cell } from './cell'
import { stageWidth, stageHeight } from './constants'
import { initBoard } from './board'
import { initOverlay } from './overlay'
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

  // Trigger an update call on every ui element with the first Game.
  store.dispatch(init(game))

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
