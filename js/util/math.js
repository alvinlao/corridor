import * as R from 'ramda'

// decUntil :: Number -> (Number -> Number)
// Decrement, but do not pass the limit.
export const decUntil = R.curry((limit, n) => R.compose(R.max(limit), R.dec)(n))

// decUntil :: Number -> (Number -> Number)
// Decrement and increment with limits.
export const incUntil = R.curry((limit, n) => R.compose(R.min(limit), R.inc)(n))
