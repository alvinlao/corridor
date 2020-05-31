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

// tweenOpacity :: Konva.Shape -> Number -> Number -> Boolean -> ()
// Animates a shape, changing its opacity to the target value (between 0 - 1),
// in the given duration (in milliseconds).
export const tweenOpacity =
  (shape, targetOpacity, durationInMs, shouldTween=true) => {
    if (!shouldTween) {
      shape.opacity(targetOpacity)
      return
    }

    const tween = new Konva.Tween({
      node: shape,
      opacity: targetOpacity,
      duration: (durationInMs / 1000),
      easing: Konva.Easings.EaseInOut,
    })
    tween.play()
  }
