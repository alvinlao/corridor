import * as R from 'ramda'
import * as Konva from 'konva'
import { initHud } from './hud'
import { addElements, attachLayer } from './util'
import { ids, turnOrder } from '../core/game'

// initOverlay :: Context -> Number -> [Element]
// Initializes overlay ui elements.
export const initOverlay = R.curry((context, numPlayers) => {
  const hudLayer = initLayer(context)
  const huds = initHuds(attachLayer(hudLayer, context), numPlayers)
  addElements(huds, hudLayer)

  return huds
})

const initLayer = R.curry((context) => {
  const layer = new Konva.Layer({
    x: (window.innerWidth - context.size) / 2,
    y: context.topMargin,
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
