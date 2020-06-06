export const RESET = 'RESET'
export const UNDO = 'UNDO'
export const REDO = 'REDO'

// reset :: a -> Action
export const reset = (state) => ({
  type: RESET,
  state,
})

// undo :: () -> Action
export const undo = () => ({
  type: UNDO,
})

// redo :: () -> Action
export const redo = () => ({
  type: REDO,
})
