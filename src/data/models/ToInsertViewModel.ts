import { Entity, Column } from 'typeorm'
import BaseModel from './BaseModel'

@Entity('to_insert_view')
export default class ToInsertViewModel extends BaseModel {
  @Column({ name: 'champ_id' })
  champId: number

  @Column()
  house: string

  @Column()
  visitor: string

  @Column()
  start: string

  constructor (init: Partial<ToInsertViewModel>) {
    super()
    Object.assign(this, init)
  }
}
