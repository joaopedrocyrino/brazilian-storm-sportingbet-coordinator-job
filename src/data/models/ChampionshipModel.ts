import { Column, Entity } from 'typeorm'
import BaseModel from './BaseModel'

@Entity('championship')
export default class ChampionshipModel extends BaseModel {
  @Column()
  season: number

  @Column()
  name: string

  @Column()
  country: string

  @Column()
  inserted: boolean

  @Column()
  closed: boolean

  @Column({ name: 'champ_id' })
  champId: number

  constructor (init: Partial<ChampionshipModel>) {
    super()
    Object.assign(this, init)
  }
}
