import * as R from 'ramda'

export const point = R.curry((row, col) => ({ row, col }))

const rowLens = R.lensProp('row')
const colLens = R.lensProp('col')

export const north = R.over(rowLens, R.inc)
export const south = R.over(rowLens, R.dec)
export const east = R.over(colLens, R.inc)
export const west = R.over(colLens, R.dec)

export const nedge = R.juxt([R.identity, east])
export const sedge = R.juxt([south, R.compose(south, east)])
export const eedge = R.juxt([east, R.compose(south, east)])
export const wedge = R.juxt([R.identity, south])

// compass :: (Point -> Point) -> ... -> Compass
// A compass provides relative point transformation functions.
const compass = (up, down, left, right, upedge, downedge, rightedge, leftedge) => ({
  up,
  down,
  left,
  right,
  upedge,
  downedge,
  rightedge,
  leftedge,
})

export const ncompass = compass(north, south, west, east, nedge, sedge, eedge, wedge)
export const scompass = compass(south, north, east, west, sedge, nedge, wedge, eedge)
export const ecompass = compass(east, west, north, south, eedge, wedge, sedge, nedge)
export const wcompass = compass(west, east, south, north, wedge, eedge, nedge, sedge)
