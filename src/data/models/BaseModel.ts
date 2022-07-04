import { Entity, PrimaryColumn, BaseEntity } from 'typeorm'

@Entity()
export default class BaseModel extends BaseEntity {
  @PrimaryColumn()
  id: string
}
