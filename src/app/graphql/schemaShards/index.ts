import { mergeRawSchemas } from '../utils/mergeRawSchemas'
import teams from './teams'
import championships from './championships'
import match from './match'

export default mergeRawSchemas(
  teams,
  championships,
  match
)
