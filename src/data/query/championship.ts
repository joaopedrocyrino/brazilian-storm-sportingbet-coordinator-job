import { FindConditions, FindOperator, ILike } from 'typeorm'

import { ChampionshipModel } from '../models'

class ChampionshipQuery {
  async create (team: Partial<ChampionshipModel>): Promise<void> {
    const newChampionship = new ChampionshipModel(team)

    await newChampionship.save()
  }

  async getMany (
    search?: string,
    fields?: { [k: string]: FindOperator<any> } | Partial<ChampionshipModel>
  ): Promise<ChampionshipModel[]> {
    const baseWhere = { ...fields }

    let where: Array<FindConditions<ChampionshipModel>> | FindConditions<ChampionshipModel> = { ...baseWhere }

    if (search) {
      where = Object.keys(ChampionshipModel)
        .map(k => ({ ...baseWhere, [k]: ILike(`%${search}%`) }))
    }

    const championships = await ChampionshipModel.find({ where })

    return championships
  }
}

export default new ChampionshipQuery()
