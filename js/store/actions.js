export const RESET = 'RESET'
export const PUSH = 'PUSH'
export const UNDO = 'UNDO'
export const REDO = 'REDO'

// reset :: a -> Action
export const reset = (state) => ({
  type: RESET,
  state,
})

// push :: Game -> Action
export const push = (game) => ({
  type: PUSH,
  game,
})

// undo :: () -> Action
export const undo = () => ({
  type: UNDO,
})

// redo :: () -> Action
export const redo = () => ({
  type: REDO,
})
