import * as R from 'ramda'
import * as Konva from 'konva'
import { game } from '../core/game'
import { addElements, attachLayer, tweenOpacity, tweenFill } from './util'

const buttonRadius = 20
const buttonMargin = 10
const optionsMargin = 20
const buttonFill = "#e0e0e0"
const buttonHoverFill = "#c0c0c0"

// initOptions :: Context -> Game -> [Element]
// Initializes options ui elements.
export const initOptions = R.curry((context) => {
  const optionsLayer = initLayer(context)
  const options = R.addIndex(R.map)(
    R.call,
    [
      initUndoButton(attachLayer(optionsLayer, context)),
      initRedoButton(attachLayer(optionsLayer, context)),
      initNewGame2P(attachLayer(optionsLayer, context)),
      initNewGame4P(attachLayer(optionsLayer, context)),
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

// initButton :: Context -> ButtonInfo -> [Element]
// Initializes a button ui.
const initButton = R.curry((context, info) => {
  const button = new Konva.Circle({
    x: ((buttonRadius * 2) + buttonMargin) * info.index + buttonRadius,
    y: 10,
    radius: buttonRadius,
    fill: buttonFill,
    opacity: 0.3,
  })

  return {
    shapes: [button, info.icon],
    bind: info.bind(context, button),
    update: info.update(context, button),
  }
})

const buttonBuilder = R.curry((context, index, params) => {
  const icon = new Konva.Shape({
    x: ((buttonRadius * 2) + buttonMargin) * index + buttonRadius,
    y: 10,
    width: (buttonRadius * 2) * 0.5,
    height: (buttonRadius * 2) * 0.5,
    stroke: "#000000",
    opacity: 0.1,
    sceneFunc: params.iconSceneFunc,
  })
  icon.listening(false)

  let isHover = false
  const updateAvailability = (button, gameStateHelper) => {
    if (!params.isAvailable(gameStateHelper)) {
      tweenOpacity(icon, 0.1, 240)
      tweenOpacity(button, 0.3, 240)
      tweenFill(button, buttonFill, 240)
    } else {
      isHover ? null : tweenOpacity(icon, 0.3, 240)
      isHover ? null : tweenFill(button, buttonFill, 240)
      tweenOpacity(button, 1, 240)
    }
  }

  const update = R.curry((context, button, gameStatesHelper) => {
    updateAvailability(button, gameStatesHelper)
  })

  const bind = R.curry((context, button, gameStatesHelper) => {
    button.on('click', params.onClick(gameStatesHelper))
    button.on('mouseover', () => {
      isHover = true
      if (params.isAvailable(gameStatesHelper)) {
        tweenOpacity(icon, 1, 240)
        tweenFill(button, buttonHoverFill, 240)
      }
    })
    button.on('mouseout', () => {
      isHover = false
      updateAvailability(button, gameStatesHelper)
      tweenFill(button, buttonFill, 240)
    })
  })

  return initButton(context, { icon, index, bind, update })
})

const initUndoButton = R.curry((context, index) => {
  const params = {
    iconSceneFunc: (cx, shape) => {
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
    isAvailable: (gameStatesHelper) => gameStatesHelper.older() >= 1,
    onClick: (gameStatesHelper) => gameStatesHelper.undo,
  }
  return buttonBuilder(context, index, params)
})

const initRedoButton = R.curry((context, index) => {
  const params = {
    iconSceneFunc: (cx, shape) => {
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      cx.beginPath()
      cx.moveTo(-width / 2, 0)
      cx.lineTo(width / 2, 0)
      cx.moveTo(0, height / 2)
      cx.lineTo(width / 2, 0)
      cx.lineTo(0, -height / 2)
      cx.fillStrokeShape(shape)
    },
    isAvailable: (gameStatesHelper) => gameStatesHelper.newer() >= 1,
    onClick: (gameStatesHelper) => gameStatesHelper.redo,
  }
  return buttonBuilder(context, index, params)
})

const initNewGame2P = R.curry((context, index) => {
  const params = {
    iconSceneFunc: (cx, shape) => {
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      const size = width / 5
      cx.beginPath()
      cx.rect(-size/2, -height/3 - size/2, size, size)
      cx.fillStrokeShape(shape)
      cx.beginPath()
      cx.rect(-size/2, height/3 - size/2, size, size)
      cx.fillStrokeShape(shape)
    },
    isAvailable: (gameStatesHelper) =>
      (gameStatesHelper.size() > 1 || gameStatesHelper.current().numPlayers != 2),
    onClick: (gameStatesHelper) => () => gameStatesHelper.reset(game(2))
  }
  return buttonBuilder(context, index, params)
})

const initNewGame4P = R.curry((context, index) => {
  const params = {
    iconSceneFunc: (cx, shape) => {
      const width = shape.getAttr('width')
      const height = shape.getAttr('height')
      const size = width / 5
      cx.beginPath()
      cx.rect(-size/2, -height/3 - size/2, size, size)
      cx.fillStrokeShape(shape)
      cx.beginPath()
      cx.rect(-size/2, height/3 - size/2, size, size)
      cx.fillStrokeShape(shape)
      cx.beginPath()
      cx.rect(-size/2 - width/3, -size/2, size, size)
      cx.fillStrokeShape(shape)
      cx.beginPath()
      cx.rect(-size/2 + width/3, -size/2, size, size)
      cx.fillStrokeShape(shape)
    },
    isAvailable: (gameStatesHelper) =>
      (gameStatesHelper.size() > 1 || gameStatesHelper.current().numPlayers != 4),
    onClick: (gameStatesHelper) => () => gameStatesHelper.reset(game(4))
  }
  return buttonBuilder(context, index, params)
})
