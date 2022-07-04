import { Column, Entity } from 'typeorm'
import BaseModel from './BaseModel'

@Entity('team')
export default class TeamModel extends BaseModel {
  @Column()
  acro: string

  @Column()
  name: string

  @Column()
  city: string

  @Column()
  country: string

  constructor (init: Partial<TeamModel>) {
    super()
    Object.assign(this, init)
  }
}
