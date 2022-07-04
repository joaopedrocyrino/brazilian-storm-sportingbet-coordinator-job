import { TeamModel } from '../models'

class TeamQuery {
  async create (team: Partial<TeamModel>): Promise<void> {
    const newTeam = new TeamModel(team)

    await newTeam.save()
  }
}

export default new TeamQuery()
