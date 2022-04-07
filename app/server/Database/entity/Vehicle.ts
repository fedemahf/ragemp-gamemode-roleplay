import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({name: 'vehicle'})
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  model: number

  @Column('int')
  player_id: number

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
