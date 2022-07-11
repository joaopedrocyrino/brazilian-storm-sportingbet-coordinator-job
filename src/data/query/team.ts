import Database from '..'
import { Team } from '../../entities'

class TeamQuery {
  async create (team: Partial<Team>): Promise<void> {
    await Database.query(
      'INSERT INTO championship (id, name, acro, city, country) VALUES ' +
    `('${team.id}', '${team.name}', '${team.acro}', '${team.city}', '${team.country}')`
    )
  }
}

export default new TeamQuery()
