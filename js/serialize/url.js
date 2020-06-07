import * as R from 'ramda'


// loadHistory :: () -> NotationHistory
// Gets the notation history from the url query param, if available.
export const loadHistory = () => {
  const base64history = new URLSearchParams(window.location.search).get('history')
  if (!base64history) {
    return ''
  }

  try {
    return atob(base64history)
  } catch (e) {
    return ''
  }
}

// replaceHistory :: State -> ()
// Adds the current game history into the browser history.
export const replaceHistory = (state) => {
  const notations = R.concat(
    R.concat(state.notation.past, [state.notation.present]),
    state.notation.future)
  const n = R.join('', notations)
  history.replaceState({}, '', '?history=' + btoa(n))
}
