import * as R from 'ramda'
import * as Konva from 'konva'
import { initHud } from './hud'
import { addElements, attachLayer } from './util'
import { playerIds } from '../core/game'

// initOverlay :: Context -> Game -> [Element]
// Initializes overlay ui elements.
export const initOverlay = R.curry((context, game) => {
  const hudLayer = initLayer(context)
  const huds = initHuds(attachLayer(hudLayer, context), game)
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

// initHuds :: Context -> Game -> [Element]
// Initializes hud ui elements.
const initHuds = R.curry((context, game) =>
  R.map(
    initHud(context, game),
    playerIds(game)))
