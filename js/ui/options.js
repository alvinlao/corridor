import * as R from 'ramda'
import * as Konva from 'konva'

import { game } from '../core/game'

import { undo, redo } from '../store/timetravel'
import { reset } from '../store/actions'
import { store } from '../store/store'

import { addElements, attachLayer, tweenOpacity } from './util'
import { topMargin } from './constants'

export const buttonRadius = 20
const buttonMargin = 10
const buttonFill = "#000000"
const buttonOpacity = 0.1
const buttonHoverOpacity = 0.3
const buttonClickOpacity = 0.5
const buttonUnavailableOpacity = 0.0
const iconUnavailableOpacity = 0.2
const iconOpacity = 0.8

// initUndoButton :: Context -> Align -> Number -> [Element]
// Creates a button that reverts the game to the previous the game state.
export const initUndoButton = R.curry((context, align, index) => {
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
    align,
    fill: null,
    isAvailable: (state) => state.game.past.length >= 1,
    onClick: () => store.dispatch(undo()),
  }
  return buildButton(context, index, params)
})

// initRedoButton :: Context -> Align -> Number -> [Element]
// Creates a button that advances the game to the next the game state.
export const initRedoButton = R.curry((context, align, index) => {
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
    align,
    fill: null,
    isAvailable: (state) => state.game.future.length >= 1,
    onClick: () => store.dispatch(redo()),
  }
  return buildButton(context, index, params)
})

// initNewGame2P :: Context -> Align -> Number -> [Element]
// Creates a button that starts a new 2 player game.
export const initNewGame2P = R.curry((context, align, index) => {
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
    align,
    fill: "#000000",
    isAvailable: (state) =>
      state.game.past.length >= 1 || state.game.present.numPlayers != 2,
    onClick: () => store.dispatch(reset(game(2))),
  }
  return buildButton(context, index, params)
})

// initNewGame4P :: Context -> Align -> Number -> [Element]
// Creates a button that starts a new 4 player game.
export const initNewGame4P = R.curry((context, align, index) => {
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
    align,
    fill: "#000000",
    isAvailable: (state) =>
      state.game.past.length >= 1 || state.game.present.numPlayers != 4,
    onClick: () => store.dispatch(reset(game(4))),
  }
  return buildButton(context, index, params)
})

const x = (context, index, align) => {
  const offset = 20
  const position = (((buttonRadius * 2) + buttonMargin) * index + buttonRadius)
  if (align === 'left') {
    return position + offset
  } else {
    return context.stage.width() - offset - position
  }
}

// buildButton :: Context -> Number -> BuildButtonParams -> [Element]
// Builds a button using the provided BuildButtonParams.
const buildButton = R.curry((context, index, params) => {
  const icon = new Konva.Shape({
    x: x(context, index, params.align),
    y: 10,
    width: (buttonRadius * 2) * 0.5,
    height: (buttonRadius * 2) * 0.5,
    stroke: "#000000",
    strokeWidth: 2,
    opacity: iconUnavailableOpacity,
    fill: params.fill,
    sceneFunc: params.iconSceneFunc,
  })
  icon.listening(false)

  let isHover = false
  const updateAvailability = (button, state) => {
    if (!params.isAvailable(state)) {
      tweenOpacity(icon, iconUnavailableOpacity, 240)
      tweenOpacity(button, buttonUnavailableOpacity, 240)
    } else {
      isHover ? null : tweenOpacity(icon, iconOpacity, 240)
      isHover ? null : tweenOpacity(button, buttonOpacity, 240)
    }
  }

  const update = R.curry((context, button, state) => {
    updateAvailability(button, state)
  })

  const bind = R.curry((context, button) => {
    button.on('mouseover', () => {
      isHover = true
      if (params.isAvailable(store.getState())) {
        document.body.style.cursor = 'pointer';
        tweenOpacity(icon, iconOpacity, 240)
        tweenOpacity(button, buttonHoverOpacity, 240)
      }
    })
    button.on('mouseout', () => {
      isHover = false
      document.body.style.cursor = 'default';
      updateAvailability(button, store.getState())
    })
    button.on('mousedown', () => {
      if (params.isAvailable(store.getState())) {
        tweenOpacity(button, buttonClickOpacity, 0)
      }
    })
    button.on('mouseup', () => {
      if (params.isAvailable(store.getState())) {
        params.onClick()

        if (params.isAvailable(store.getState())) {
          tweenOpacity(button, buttonHoverOpacity, 0)
        } else {
          document.body.style.cursor = 'default';
        }
      }
    })
  })

  return initButton(context, { icon, index, bind, update }, params.align)
})

// initButton :: Context -> ButtonInfo -> Align -> [Element]
// Initializes a button ui.
const initButton = R.curry((context, info, align) => {
  const button = new Konva.Circle({
    x: x(context, info.index, align),
    y: 10,
    radius: buttonRadius,
    fill: buttonFill,
    opacity: buttonUnavailableOpacity,
  })
  info.bind(context, button)

  return {
    shapes: [button, info.icon],
    update: info.update(context, button),
  }
})
