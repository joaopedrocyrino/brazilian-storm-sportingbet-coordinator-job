import Database from '..'
import { Match } from '../../entities'

class MatchQuery {
  async create (match: Partial<Match>): Promise<void> {
    await Database.query(
      'INSERT INTO match (id, championship_id, house_id, visitor_id, "start", "end") VALUES ' +
      `('${match.id}', '${match.champId}', '${match.houseId}', '${match.visitorId}', '${match.start}', '${match.end}')`
    )
  }

  async insert (ids: string[]): Promise<void> {
    let queryString = 'UPDATE match SET inserted = \'t\' WHERE id IN ('

    ids.forEach(id => { queryString += `'${id}', ` })

    queryString = queryString.slice(0, -2)

    queryString += ')'

    await Database.query(queryString)
  }

  async close (ids: string[]): Promise<void> {
    let queryString = 'UPDATE match SET closed = \'t\' WHERE id IN ('

    ids.forEach(id => { queryString += `'${id}', ` })

    queryString = queryString.slice(0, -2)

    queryString += ')'

    await Database.query(queryString)
  }

  async fullfillResults (id: string, house: number, visitor: number): Promise<void> {
    const queryString = `UPDATE match SET fullfilled = 't', house_goals = ${house}, visitor_goals = ${visitor} WHERE id = '${id}'`

    await Database.query(queryString)
  }

  async getToInsert (): Promise<Array<{ id: string, house: string, visitor: string, start: string, champId: string }>> {
    const matches = await Database.query<{
      id: string
      house: string
      visitor: string
      start: string
      name: string
      season: number
      country: string
    }>(
      'SELECT ' +
      'm.id as id, h.acro as house, v.acro as visitor, m.start as start, c.name as name, c.season as season, c.country as country ' +
      'FROM match AS m ' +
      'INNER JOIN team as h on h.id = m.house_id ' +
      'INNER JOIN team as v on v.id = m.visitor_id ' +
      'INNER JOIN championship as c on c.id = m.championship_id ' +
      'WHERE m.inserted = \'f\' AND m.closed = \'f\''
    )

    const res = []

    await Promise.all(matches.map(async ({ name, season, country, ...m }) => {
      const champ = await Database.graphQuery<{ id: string }>(`SELECT id FROM championship WHERE name = '${name}' AND season = ${season} AND country = '${country}'`)
      res.push({
        ...m,
        champId: champ[0].id
      })
    }))

    return res
  }

  async getToFullfill (): Promise<Array<{ id: string, house: number, visitor: number, champId: string, matchId: string }>> {
    const matches = await Database.query<{
      id: string
      name: string
      season: number
      country: string
      house: string
      visitor: string
      house_goals: number
      visitor_goals: number
    }>(
      'SELECT ' +
      'm.id as id, ' +
      'c.name as name, ' +
      'c.season as season, ' +
      'c.country as country, ' +
      'm.house_goals as house_goals ' +
      'm.visitor_goals as visitor_goals, ' +
      'h.acro as house, ' +
      'v.acro as visitor ' +
      'FROM match m ' +
      'INNER JOIN championship c on c.id = m.championship_id ' +
      'INNER JOIN team h on h.id = m.house_id ' +
      'INNER JOIN team v on v.id = m.visitor_id ' +
      'WHERE inserted = \'t\' AND fullfilled = \'t\' AND closed = \'f\''
    )

    const res = []

    await Promise.all(matches.map(async ({ name, season, country, house, visitor, ...m }) => {
      const champ = await Database.graphQuery<{ id: string }>(`SELECT id FROM championship WHERE name = '${name}' AND season = ${season} AND country = '${country}'`)
      const match = await Database.graphQuery<{ id: string }>(`SELECT id FROM match WHERE house = '${house}' AND visitor = '${visitor}' AND champ_id = '${champ[0].id}'`)
      res.push({
        id: m.id,
        house: m.house_goals,
        visitor: m.visitor_goals,
        champId: champ[0].id,
        matchId: match[0].id
      })
    }))

    return res
  }
}

export default new MatchQuery()
