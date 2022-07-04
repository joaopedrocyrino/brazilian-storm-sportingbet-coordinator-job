import { UserInputError } from 'apollo-server'
import { FindConditions, FindOperator, ILike } from 'typeorm'

import { MatchModel, ToFullfillViewModel, ToInsertViewModel } from '../models'

class MatchQuery {
  async create (match: Partial<MatchModel>): Promise<void> {
    const newMatch = new MatchModel(match)

    await newMatch.save()
  }

  async getOne (id: string): Promise<MatchModel> {
    const match = await MatchModel.findOne({ id })
    if (!match) { throw new UserInputError('Match not found') }

    return match
  }

  async update ({ id, ...fields }: Partial<MatchModel>): Promise<void> {
    const match = await this.getOne(id)

    Object.keys(fields).forEach(k => {
      match[k] = fields[k]
    })

    await match.save()
  }

  async getToInsert (): Promise<ToInsertViewModel[]> {
    const matches = await ToInsertViewModel.find()
    return matches
  }

  async getToFullfill (): Promise<ToFullfillViewModel[]> {
    const matches = await ToFullfillViewModel.find()
    return matches
  }

  async getMany (
    search?: string,
    fields?: { [k: string]: FindOperator<any> } | Partial<MatchModel>
  ): Promise<MatchModel[]> {
    const baseWhere = { ...fields }

    let where: Array<FindConditions<MatchModel>> | FindConditions<MatchModel> = { ...baseWhere }

    if (search) {
      where = Object.keys(MatchModel)
        .map(k => ({ ...baseWhere, [k]: ILike(`%${search}%`) }))
    }

    const mathces = await MatchModel.find({ where })

    return mathces
  }
}

export default new MatchQuery()
