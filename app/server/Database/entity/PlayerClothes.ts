import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({name: 'player_clothes'})
export class PlayerClothes {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  player_id: number

  @Column('int')
  component: number

  @Column('int')
  drawable: number

  @Column('int')
  texture: number

  @Column('boolean')
  is_prop: boolean
}
