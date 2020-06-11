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
import { initLayer } from './layer'

// initOverlay :: Context -> [Element]
// Initializes overlay ui elements.
export const initOverlay = (context) =>
  initLayer(
    context,
    overlayLayer(context),
    R.unnest([
      initHuds(context, 2),
      initHuds(context, 4),
      initOptions(context),
    ]))

const overlayLayer = (context) => (
  new Konva.Layer({
    x: 0,
    y: topMargin - 60,
  }))

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
