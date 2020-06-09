import * as R from 'ramda'

// iterate :: Number -> (a -> a) -> a -> [a]
// Creates a list of size N where the first item is the input value,
// the second item is calculated by applying the function on the input
// value, and the third item is calculated by applying the function
// on the second item and so on.
export const iterate = (n, f, x) => {
  const _iterate = (n, f, x, xs) => {
    if (n <= 0) {
      return xs
    } else {
      return _iterate(n - 1, f, f(x), R.append(f(x), xs))
    }
  }

  return _iterate(n - 1, f, x, [x])
}

// middle :: [a] -> [a]
// Returns the original list without the first and last element.
export const middle = R.pipe(R.tail, R.init)

// cycle :: Number -> [a] -> [a]
// Repeats the provided array n times.
// cycle(2, [1, 2, 3]) // => [1, 2, 3, 1, 2, 3]
export const cycle = R.curry((n, xs) => R.unnest(R.repeat(xs, n)))
