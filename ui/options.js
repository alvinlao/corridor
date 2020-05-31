import * as R from 'ramda'
import * as Konva from 'konva'
import { addElements, attachLayer } from './util'

const buttonRadius = 20
const buttonMargin = 10
const optionsMargin = 20

// initOptions :: Context -> Game -> [Element]
// Initializes options ui elements.
export const initOptions = R.curry((context, game) => {
  const optionsLayer = initLayer(context)
  const options = [
    initButton(attachLayer(optionsLayer, context), game, 0, R.identity, R.identity),
    initButton(attachLayer(optionsLayer, context), game, 1, R.identity, R.identity),
    initButton(attachLayer(optionsLayer, context), game, 2, R.identity, R.identity),
    initButton(attachLayer(optionsLayer, context), game, 3, R.identity, R.identity),
  ]
  addElements(options, optionsLayer)

  return options
})

const initLayer = R.curry((context) => {
  const layer = new Konva.Layer({
    x: (window.innerWidth - context.size) / 2,
    y: context.topMargin - (buttonRadius * 2) - optionsMargin,
  })
  context.stage.add(layer)
  return layer
})

// initButton :: Context -> Game -> Number -> BindFunc -> UpdateFunc -> [Element]
// Initializes a button ui.
const initButton = R.curry((context, game, buttonNumber, bind, update) => {
  const button = new Konva.Circle({
    x: ((buttonRadius * 2) + buttonMargin) * buttonNumber + buttonRadius,
    y: 10,
    radius: buttonRadius,
    fill: "#eeeeee",
  })

  return {
    shapes: [button],
    bind,
    update,
  }
})
