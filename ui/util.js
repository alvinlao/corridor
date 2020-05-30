import * as R from 'ramda'

// addElements :: [Element] -> Konva.Layer -> ()
export const addElements = R.curry((elements, layer) =>
  R.pipe(
    shapes,
    R.unnest,
    R.forEach(s => layer.add(s)))
  (elements))

// attachLayer :: Konva.Layer -> Context -> Context
// Adds the layer to the context object.
export const attachLayer = R.curry((layer, context) =>
  R.set(R.lensProp('layer'), layer, context))

// shapes :: [Element] -> [[Shape]]
const shapes = R.map(R.prop('shapes'))
