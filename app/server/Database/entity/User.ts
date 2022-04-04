import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 64 })
  name: string

  @Column('varchar', { length: 256 })
  email: string

  @Column('varchar', { length: 128 })
  password: string

  @Column('varchar', { length: 32 })
  salt: string

  @Column({ type: 'int', default: 0, width: 11 })
  admin: number
}
