import * as R from 'ramda'

export const point = (row, col) => ({ row, col })

export const north = R.over(rowLens, R.inc)
export const south = R.over(rowLens, R.dec)
export const east = R.over(colLens, R.inc)
export const west = R.over(colLens, R.dec)

const rowLens = R.lensProp('row')
const colLens = R.lensProp('col')
