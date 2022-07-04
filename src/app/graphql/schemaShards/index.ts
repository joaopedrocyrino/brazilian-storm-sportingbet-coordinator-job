import { mergeRawSchemas } from '../utils/mergeRawSchemas'
import teams from './teams'
import championships from './championships'
import match from './match'
import bets from './bets'

export default mergeRawSchemas(
  teams,
  championships,
  match,
  bets
)
