import * as R from 'ramda'
import * as Konva from 'konva'

import { game } from '../../core/game'

import { undo, redo } from '../../store/timetravel'
import { reset } from '../../store/actions'
import { store } from '../../store/store'
import { past, present, future } from '../../store/undoable'

import { tweenOpacity } from './animation'
import { topMargin } from './constants'
import { cellSize, cellMargin, offsetX } from './cell'

const buttonRadius = (context) => (cellSize(context) / 2)
const buttonMargin = cellMargin
const buttonFill = "#000000"
const buttonSelectedOpacity = 0.08
const buttonAvailableOpacity = 0.2
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
    isAvailable: (state) => past(state.game).length >= 1,
    isSelected: R.F,
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
    isAvailable: (state) => future(state.game).length >= 1,
    isSelected: R.F,
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
    isAvailable: (state) => (
        future(state.game).length >= 1
        || past(state.game).length >= 1
        || present(state.game).numPlayers != 2
      ),
    isSelected: (state) => present(state.game).numPlayers == 2,
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
    isAvailable: (state) => (
        future(state.game).length >= 1 ||
        past(state.game).length >= 1 ||
        present(state.game).numPlayers != 4
      ),
    isSelected: (state) => present(state.game).numPlayers == 4,
    onClick: () => store.dispatch(reset(game(4))),
  }
  return buildButton(context, index, params)
})

const x = (context, index, align) => {
  const offset = offsetX(context)
  const position =
    (((buttonRadius(context) * 2) + buttonMargin(context)) * index + buttonRadius(context))
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
    width: (buttonRadius(context) * 2) * 0.5,
    height: (buttonRadius(context) * 2) * 0.5,
    stroke: "#000000",
    strokeWidth: 2,
    opacity: iconUnavailableOpacity,
    fill: params.fill,
    sceneFunc: params.iconSceneFunc,
  })
  icon.listening(false)

  let isHover = false
  const updateAvailability = (button, state) => {
    const isSelected = params.isSelected(state)
    const isAvailable = params.isAvailable(state)
    if (isSelected && isAvailable) {
      tweenOpacity(icon, iconOpacity, 240)
      tweenOpacity(button, buttonSelectedOpacity, 240)
    } else if (isSelected && !isAvailable) {
      tweenOpacity(icon, iconUnavailableOpacity, 240)
      tweenOpacity(button, buttonSelectedOpacity, 240)
    } else if (!isSelected && isAvailable) {
      isHover ? null : tweenOpacity(icon, iconOpacity, 240)
      isHover ? null : tweenOpacity(button, 0, 240)
    } else {
      tweenOpacity(icon, iconUnavailableOpacity, 240)
      tweenOpacity(button, buttonUnavailableOpacity, 240)
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
    radius: buttonRadius(context),
    fill: buttonFill,
    opacity: buttonUnavailableOpacity,
  })
  info.bind(context, button)

  return {
    shapes: [button, info.icon],
    update: info.update(context, button),
  }
})
