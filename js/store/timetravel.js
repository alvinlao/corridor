export const RESET = 'RESET'
export const UNDO = 'UNDO'
export const REDO = 'REDO'
export const GOTO = 'GOTO'

// undo :: () -> Action
export const undo = () => ({ type: UNDO })

// redo :: () -> Action
export const redo = () => ({ type: REDO })

// goto :: Number -> Action
export const goto = (index) => ({ type: GOTO, index })
