import * as R from 'ramda'
import * as Konva from 'konva'

import { ids, turnOrder } from '../core/game'

import { topMargin } from './constants'
import { initHud } from './hud'
import { addElements, attachLayer } from './util'

// initOverlay :: Context -> Number -> [Element]
// Initializes overlay ui elements.
export const initOverlay = R.curry((context, numPlayers) => {
  const overlayLayer = initLayer(context)
  const huds = initHuds(attachLayer(overlayLayer, context), numPlayers)
  addElements(huds, overlayLayer)

  return huds
})

const initLayer = R.curry((context) => {
  const layer = new Konva.Layer({
    x: 0,
    y: topMargin,
  })
  context.stage.add(layer)
  return layer
})

// initHuds :: Context -> Number -> [Element]
// Initializes hud ui elements.
const initHuds = R.curry((context, numPlayers) =>
  R.addIndex(R.map)(
    initHud(context, numPlayers),
    R.filter(R.includes(R.__, ids(numPlayers)), turnOrder)))
