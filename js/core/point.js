import * as R from 'ramda'

// point :: Number -> Number -> Point
// Creates a new point.
export const point = R.curry((row, col) => ({ row, col }))

const rowLens = R.lensProp('row')
const colLens = R.lensProp('col')

// north, south, east, west :: Point -> Point
// Returns the point one step in the requested direction.
export const north = R.over(rowLens, R.inc)
export const south = R.over(rowLens, R.dec)
export const east = R.over(colLens, R.inc)
export const west = R.over(colLens, R.dec)

// nedge, sedge, eedge, wedge :: Point -> Edge
// Edge :: [Point]
// Returns the two points that define the edge in the requested direction.
export const nedge = R.juxt([R.identity, east])
export const sedge = R.juxt([south, R.compose(south, east)])
export const eedge = R.juxt([east, R.compose(south, east)])
export const wedge = R.juxt([R.identity, south])

// compass :: (Point -> Point) -> ... (Point -> [Point]) -> ... -> Compass
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

// ncompass, scompass, ecompass, wcompass :: Compass
export const ncompass = compass(north, south, west, east, nedge, sedge, eedge, wedge)
export const scompass = compass(south, north, east, west, sedge, nedge, wedge, eedge)
export const ecompass = compass(east, west, north, south, eedge, wedge, sedge, nedge)
export const wcompass = compass(west, east, south, north, wedge, eedge, nedge, sedge)
