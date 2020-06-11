import * as R from 'ramda'

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

// tweenFill :: Konva.Shape -> String -> Number -> Boolean -> ()
// Animates a shape, changing its fill to the target value,
// in the given duration (in milliseconds).
export const tweenFill =
  (shape, targetFill, durationInMs, shouldTween=true) => {
    if (!shouldTween) {
      shape.fill(targetFill)
      return
    }

    const tween = new Konva.Tween({
      node: shape,
      fill: targetFill,
      duration: (durationInMs / 1000),
      easing: Konva.Easings.EaseInOut,
    })
    tween.play()
  }
