import * as R from 'ramda'

export const wall = (topLeft, orientation) => ({ topLeft, orientation })
export const hwall = (topLeft) => wall(topLeft, 'h')
export const vwall = (topLeft) => wall(topLeft, 'v')

export const isVeritcal = R.compose(R.equals('v'), R.prop('orientation'))
export const isHorizontal = R.compose(R.equals('h'), R.prop('orientation'))
