export const PUSH = 'PUSH'

// push :: Game -> Action
export const push = (game) => ({
  type: PUSH,
  game,
})
