import * as R from 'ramda'

// id :: Reducer -> IdState a -> Action -> IdState a
// Creates a Reducer Enhancer that converts the state to an IdState.
export const id = (reducer) => (state=reducer(undefined, {}), action) => {
  const newState = reducer(state, action)
  if (state === newState) {
    return state
  }
  return idState(newState)
}

// idState :: State a -> IdState a
// Adds an 'id' key to the provided state.
export const idState = (state) =>
  R.set(
    R.lensProp('id'),
    R.toString(R.omit(['id'], state)),
    state)
