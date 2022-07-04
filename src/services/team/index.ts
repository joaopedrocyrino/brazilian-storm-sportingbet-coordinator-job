import Services from '..'
import { CreateTeam } from '../../dto'
import { TeamQuery } from '../../data/query'
import { createValidator } from './validators'

class TeamServices extends Services {
  async create ({ token, ...req }: CreateTeam): Promise<string> {
    await this.gateway({
      req,
      schema: createValidator,
      token,
      scope: true
    })

    const base = this.createBase()

    await TeamQuery.create({ ...req, ...base })

    return base.id
  }
};

export default new TeamServices()
