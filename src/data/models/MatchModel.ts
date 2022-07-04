import { Column, Entity } from 'typeorm'
import BaseModel from './BaseModel'

@Entity('match')
export default class MatchModel extends BaseModel {
  @Column({ name: 'championship_id' })
  championshipId: string

  @Column({ name: 'house_id' })
  houseId: string

  @Column({ name: 'visitor_id' })
  visitorId: string

  @Column({ name: 'house_goals' })
  houseGoals: number

  @Column({ name: 'visitor_goals' })
  visitorGoals: number

  @Column()
  start: string

  @Column()
  end: string

  @Column()
  inserted: boolean

  @Column()
  closed: boolean

  @Column()
  fullfilled: boolean

  @Column({ name: 'match_id' })
  matchId?: number

  constructor (init: Partial<MatchModel>) {
    super()
    Object.assign(this, init)
  }
}
