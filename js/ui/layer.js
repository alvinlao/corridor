import * as R from 'ramda'

// initLayer :: Context -> Konva.Layer -> [Element] -> [Element]
// Attaches the layer to the stage and adds the elements to the layer.
export const initLayer = (context, konva, elements) =>
  R.pipe(
    addLayerToStage(context),
    addElementsToLayer(elements),
    layerElements)
  (layer(konva))

// layer :: Konva.Layer -> Layer
// An internal wrapper around Konva.Layer.
const layer = (konva) => ({
  konva,
  elements: [],
})

// addElementsToLayer :: Layer -> [Element] -> Layer
const addElementsToLayer = R.curry((elements, layer) =>
  R.pipe(
    R.over(R.lensProp('konva'), addElementsToKonva(elements)),
    R.over(R.lensProp('elements'), R.concat(elements)))
  (layer))

// addElementsToKonva :: [Element] -> Layer -> Konva.Layer -> Layer
const addElementsToKonva = R.curry((elements, layer) =>
  R.pipe(shapes, R.forEach(s => layer.add(s)), R.always(layer))(elements))

// shapes :: [Element] -> [Shape]
const shapes = R.chain(R.prop('shapes'))

// addLayerToStage :: Context -> Layer -> Layer
// Mutates context by adding the Konva layer to the stage.
const addLayerToStage = R.curry((context, layer) => {
  context.stage.add(R.prop('konva', layer))
  return layer
})

// layerElements :: Layer -> [Element]
const layerElements = R.prop('elements')
