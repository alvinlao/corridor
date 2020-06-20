import * as R from 'ramda'
import Konva from 'konva/lib/Core'
import { Circle } from 'konva/lib/shapes/Circle'

import { game } from '../../core/game'

import { undo, redo } from '../../store/timetravel'
import { reset } from '../../store/actions'
import { store } from '../../store/store'
import { past, present, future } from '../../store/undoable'

import { tweenOpacity } from './animation'
import { cellSize, cellMargin, offsetX } from './cell'
import { black } from './constants'

const buttonRadius = (context) => (cellSize(context) / 2)
const buttonMargin = cellMargin
const bgSelectedOpacity = 0.08
const bgHoverOpacity = 0.3
const bgClickOpacity = 0.5
const bgUnavailableOpacity = 0.0
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
    iconFill: black,
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
    iconFill: black,
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

// x :: Context -> Number -> Align -> Number
// Calculates a button's x position.
const x = (context, index, align) => {
  const offset = offsetX(context)
  const position =
    (
      ((buttonRadius(context) * 2) + buttonMargin(context))
      * index
      + buttonRadius(context)
    )
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
    stroke: black,
    strokeWidth: 2,
    opacity: iconUnavailableOpacity,
    fill: params.iconFill,
    sceneFunc: params.iconSceneFunc,
  })
  icon.listening(false)

  let isHover = false
  const updateAvailability = (bg, state) => {
    const isSelected = params.isSelected(state)
    const isAvailable = params.isAvailable(state)
    if (isSelected && isAvailable) {
      tweenOpacity(icon, iconOpacity, 240)
      tweenOpacity(bg, bgSelectedOpacity, 240)
    } else if (isSelected && !isAvailable) {
      tweenOpacity(icon, iconUnavailableOpacity, 240)
      tweenOpacity(bg, bgSelectedOpacity, 240)
    } else if (!isSelected && isAvailable) {
      isHover ? null : tweenOpacity(icon, iconOpacity, 240)
      isHover ? null : tweenOpacity(bg, 0, 240)
    } else {
      tweenOpacity(icon, iconUnavailableOpacity, 240)
      tweenOpacity(bg, bgUnavailableOpacity, 240)
    }
  }

  const update = R.curry((context, bg, state) => {
    updateAvailability(bg, state)
  })

  const bind = R.curry((context, bg) => {
    bg.on('mouseover', () => {
      isHover = true
      if (params.isAvailable(store.getState())) {
        document.body.style.cursor = 'pointer';
        tweenOpacity(icon, iconOpacity, 240)
        tweenOpacity(bg, bgHoverOpacity, 240)
      }
    })
    bg.on('mouseout', () => {
      isHover = false
      document.body.style.cursor = 'default';
      updateAvailability(bg, store.getState())
    })
    bg.on('mousedown', () => {
      if (params.isAvailable(store.getState())) {
        tweenOpacity(bg, bgClickOpacity, 0)
      }
    })
    bg.on('mouseup', () => {
      if (params.isAvailable(store.getState())) {
        params.onClick()

        if (params.isAvailable(store.getState())) {
          tweenOpacity(bg, bgHoverOpacity, 0)
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
  const bg = new Konva.Circle({
    x: x(context, info.index, align),
    y: 10,
    radius: buttonRadius(context),
    fill: bgFill,
    opacity: bgUnavailableOpacity,
  })
  info.bind(context, bg)

  return {
    shapes: [bg, info.icon],
    update: info.update(context, bg),
  }
})
