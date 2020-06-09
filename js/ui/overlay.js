import * as R from 'ramda'
import * as Konva from 'konva'

import { ids, turnOrder } from '../core/game'

import { topMargin } from './constants'
import { initHud } from './hud'
import {
  initUndoButton,
  initRedoButton,
  initNewGame2P,
  initNewGame4P,
} from './options'
import { addElements, attachLayer } from './util'

// initOverlay :: Context -> [Element]
// Initializes overlay ui elements.
export const initOverlay = R.curry((context) => {
  const overlayLayer = initLayer(context)
  
  const hud2Player = initHuds(attachLayer(overlayLayer, context), 2)
  const hud4Player = initHuds(attachLayer(overlayLayer, context), 4)
  addElements(hud2Player, overlayLayer)
  addElements(hud4Player, overlayLayer)

  const options = initOptions(attachLayer(overlayLayer, context))
  addElements(options, overlayLayer)

  return R.unnest([hud2Player, hud4Player, options])
})

const initLayer = R.curry((context) => {
  const layer = new Konva.Layer({
    x: 0,
    y: topMargin - 60,
  })
  context.stage.add(layer)
  return layer
})

// initHuds :: Context -> Number -> [Element]
// Initializes hud ui elements.
const initHuds = R.curry((context, numPlayers) =>
  R.addIndex(R.map)(
    initHud(context, numPlayers),
    turnOrder(ids(numPlayers))))

const initOptions = (context) => [
  initUndoButton(context, 'right', 1),
  initRedoButton(context, 'right', 0),
  initNewGame4P(context, 'left', 1),
  initNewGame2P(context, 'left', 0),
]
