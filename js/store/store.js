import * as R from 'ramda'
import { createStore } from 'redux'
import { app } from './reducers'

// store :: Store
// A singleton redux store that represents the state of the app.
export const store = createStore(app)

// observeStore :: Store -> Lens a Store -> (a -> ()) -> Unsubscribe
// Registers a handler that's called when the store changes.
// Returns an unsubscribe function that unregisters the callback.
export const observeStore = (store, lens, onChange) => {
  let currentState;

  const handleChange = () => {
    let nextState = R.view(lens, store.getState())
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
