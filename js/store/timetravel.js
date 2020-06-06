export const RESET = 'RESET'
export const UNDO = 'UNDO'
export const REDO = 'REDO'

// undo :: () -> Action
export const undo = () => ({
  type: UNDO,
})

// redo :: () -> Action
export const redo = () => ({
  type: REDO,
})
