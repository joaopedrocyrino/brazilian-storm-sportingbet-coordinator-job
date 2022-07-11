import Database from '..'
import { Championship } from '../../entities'

class ChampionshipQuery {
  async create (champ: Partial<Championship>): Promise<void> {
    await Database.query(
      'INSERT INTO championship (id, name, season, country) VALUES ' +
    `('${champ.id}', '${champ.name}', ${champ.season}, '${champ.country}')`
    )
  }

  async getMany (): Promise<Championship[]> {
    const champs = await Database.query<Championship>(
      'SELECT * FROM championship WHERE inserted = \'f\' AND closed = \'f\''
    )

    return champs
  }

  async insert (ids: string[]): Promise<void> {
    let queryString = 'UPDATE championship SET inserted = \'t\' WHERE id IN ('

    ids.forEach(id => { queryString += `'${id}', ` })

    queryString = queryString.slice(0, -2)

    queryString += ')'

    await Database.query(queryString)
  }
}

export default new ChampionshipQuery()
