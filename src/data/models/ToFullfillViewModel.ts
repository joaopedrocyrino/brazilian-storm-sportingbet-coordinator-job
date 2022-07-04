import { Entity, Column } from 'typeorm'
import BaseModel from './BaseModel'

@Entity('to_fullfill_view')
export default class ToFullfillViewModel extends BaseModel {
  @Column({ name: 'champ_id' })
  champId: number

  @Column({ name: 'match_id' })
  matchId: number

  @Column()
  house: number

  @Column()
  visitor: number

  constructor (init: Partial<ToFullfillViewModel>) {
    super()
    Object.assign(this, init)
  }
}
