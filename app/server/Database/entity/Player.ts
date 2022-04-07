import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({name: 'player'})
export class Player {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  user_id: number

  @Column('varchar', { length: 64 })
  firstName: string

  @Column('varchar', { length: 64 })
  lastName: string

  @Column('float')
  pos_x: number

  @Column('float')
  pos_y: number

  @Column('float')
  pos_z: number

  @Column('float')
  pos_rz: number

  @Column('int')
  dimension: number
}
