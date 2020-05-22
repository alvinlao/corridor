import * as R from 'ramda'
import { board, putPlayer, putWall } from './board'
import { point } from './point'
import { hwall } from './wall'


const gameDefinition = {
  rows: 9,
  cols: 9,
  numPlayers: 2,
  startingLocations: [
    point(0, 4),
    point(8, 4),
    point(4, 0),
    point(8, 0),
  ],
}

const myboard = board(gameDefinition)
const putPlayer1 = putPlayer(0)
const putPlayer2 = putPlayer(1)
const moves = [
  putWall(hwall(point(0, 0))),
  putPlayer1(point(0, 1)),
  putPlayer1(point(0, 2)),
  putPlayer1(point(0, 3)),
  putPlayer2(point(0, 2)),
]

console.log(JSON.stringify(R.apply(R.pipe, moves)(myboard), null, 4))
