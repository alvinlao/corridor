import * as R from 'ramda'
import * as Konva from 'konva'
import { addElements, attachLayer, tweenOpacity, tweenFill } from './util'

const buttonRadius = 20
const buttonMargin = 10
const optionsMargin = 20
const buttonFill = "#e0e0e0"
const buttonHoverFill = "#c0c0c0"

// initOptions :: Context -> Game -> [Element]
// Initializes options ui elements.
export const initOptions = R.curry((context, game) => {
  const optionsLayer = initLayer(context)
  const options = R.addIndex(R.map)(
    R.call,
    [
      initUndoButton(attachLayer(optionsLayer, context), game),
      initNewGame(attachLayer(optionsLayer, context), game),
    ])
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

// initButton :: Context -> Game -> ButtonInfo -> [Element]
// Initializes a button ui.
const initButton = R.curry((context, game, info) => {
  const button = new Konva.Circle({
    x: ((buttonRadius * 2) + buttonMargin) * info.index + buttonRadius,
    y: 10,
    radius: buttonRadius,
    fill: buttonFill,
  })

  return {
    shapes: [button, info.icon],
    bind: info.bind(context, button),
    update: info.update(context, button),
  }
})

const initUndoButton = R.curry((context, game, index) => {
  const icon = new Konva.Shape({
    x: ((buttonRadius * 2) + buttonMargin) * index + buttonRadius,
    y: 10,
    width: (buttonRadius * 2) * 0.5,
    height: (buttonRadius * 2) * 0.5,
    stroke: "#000000",
    opacity: 0.1,
    sceneFunc: (cx, shape) => {
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      cx.beginPath()
      cx.moveTo(width / 2, 0)
      cx.lineTo(-width / 2, 0)
      cx.moveTo(0, height / 2)
      cx.lineTo(-width / 2, 0)
      cx.lineTo(0, -height / 2)
      cx.fillStrokeShape(shape)
    },
  })
  icon.listening(false)

  let isHover = false
  const updateAvailability = (button, stackSize) => {
    if (stackSize <= 1) {
      tweenOpacity(icon, 0.1, 240)
      tweenOpacity(button, 0.3, 240)
      tweenFill(button, buttonFill, 240)
    } else {
      isHover ? null : tweenOpacity(icon, 0.3, 240)
      isHover ? null : tweenFill(button, buttonFill, 240)
      tweenOpacity(button, 1, 240)
    }
  }

  const update = R.curry((context, button, gameStates) => {
    updateAvailability(button, gameStates.size())
  })

  const bind = R.curry((context, button, gameStates) => {
    button.on('click', gameStates.pop)
    button.on('mouseover', () => {
      isHover = true
      if (gameStates.size() > 1) {
        tweenOpacity(icon, 1, 240)
        tweenFill(button, buttonHoverFill, 240)
      }
    })
    button.on('mouseout', () => {
      isHover = false
      updateAvailability(button, gameStates.size())
        tweenFill(button, buttonFill, 240)
    })
  })

  return initButton(
    context,
    game,
    { icon, index, bind, update })
})

const initNewGame = R.curry((context, game, index) => {
  const size = (buttonRadius * 2) * 0.5
  const icon = new Konva.Shape({
    x: ((buttonRadius * 2) + buttonMargin) * index + buttonRadius,
    y: 10,
    width: size,
    height: size,
    stroke: "#000000",
    opacity: 0.3,
    sceneFunc: (cx, shape) => {
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      cx.beginPath()
      cx.moveTo(0, -height / 2)
      cx.lineTo(0, height / 2)
      cx.moveTo(-width / 2, 0)
      cx.lineTo(width / 2, 0)
      cx.fillStrokeShape(shape)
    },
  })
  icon.listening(false)

  return initButton(
    context,
    game,
    { icon, index, bind: () => () => {}, update: () => () => {} })
})
