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

// loadMove :: () -> Number
// Gets the move number from the url query param, if available.
export const loadMove = () => {
  const move = new URLSearchParams(window.location.search).get('move')
  if (!move) {
    return 0
  } else {
    return parseInt(move)
  }
}

// replaceUrl :: State -> ()
// Adds the current game history into the browser history.
export const replaceUrl = (state) => {
  const move = state.notation.index
  const notations = state.notation.history
  const history = urlEncode(R.join('', R.pluck('notation', notations)))
  const params = new URLSearchParams({ move, history })
  window.history.replaceState({}, '', '?' + params.toString())
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
