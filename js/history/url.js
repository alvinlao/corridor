import * as R from 'ramda'


// loadHistory :: () -> NotationHistory
// Gets the notation history from the url query param, if available.
export const loadHistory = () => {
  const base64history = new URLSearchParams(window.location.search).get('history')
  if (!base64history) {
    return ''
  }

  try {
    return urlDecode(base64history)
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
  const n = R.join('', R.map(R.prop('notation'), notations))
  history.replaceState({}, '', '?history=' + urlEncode(n))
}

// urlEncode :: Binary -> String
// Binary :: String
// Converts binary data to a base64 url friendly string.
const urlEncode = (unencoded) =>
  btoa(unencoded).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

// urlDecode :: String -> Binary
// Binary :: String
// Converts a base64 url friendly string to binary data.
const urlDecode = (encoded) => {
  var encoded = encoded.replace('-', '+').replace('_', '/');
  while (encoded.length % 4)
    encoded += '=';
  return atob(encoded);
};
