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
